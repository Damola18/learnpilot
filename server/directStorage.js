import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DirectStorage {
    constructor() {
        this.db = null
        this.dbPath = path.join(__dirname, 'data', 'learning_paths_direct.db')
        this.ensureDataDirectory()
    }

    ensureDataDirectory() {
        const dataDir = path.dirname(this.dbPath)
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true })
        }
    }

    async connect() {
        if (this.db) return this.db

        try {
            this.db = await open({
                filename: this.dbPath,
                driver: sqlite3.Database,
            })

            // Create tables if they don't exist
            await this.db.exec(`
                CREATE TABLE IF NOT EXISTS learning_paths (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT,
                    difficulty TEXT,
                    total_duration TEXT,
                    module_count INTEGER,
                    status TEXT DEFAULT 'not_started',
                    domain TEXT,
                    tags TEXT, -- JSON string
                    curriculum TEXT, -- JSON string
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `)

            console.log('Direct storage database initialized successfully')
            return this.db
        } catch (error) {
            console.error(
                'Failed to connect to direct storage database:',
                error,
            )
            throw error
        }
    }

    async saveLearningPath(learningPath, metadata = {}) {
        const db = await this.connect()

        try {
            const pathRecord = {
                id: learningPath.id,
                title: learningPath.title,
                description: learningPath.description,
                difficulty: learningPath.difficulty || 'intermediate',
                total_duration: learningPath.totalDuration || '2 hours',
                module_count: learningPath.modules?.length || 0,
                status: 'not_started',
                domain: metadata.domain || 'general',
                tags: JSON.stringify(metadata.tags || []),
                curriculum: JSON.stringify(learningPath),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            await db.run(
                `
                INSERT OR REPLACE INTO learning_paths 
                (id, title, description, difficulty, total_duration, module_count, status, domain, tags, curriculum, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
                [
                    pathRecord.id,
                    pathRecord.title,
                    pathRecord.description,
                    pathRecord.difficulty,
                    pathRecord.total_duration,
                    pathRecord.module_count,
                    pathRecord.status,
                    pathRecord.domain,
                    pathRecord.tags,
                    pathRecord.curriculum,
                    pathRecord.created_at,
                    pathRecord.updated_at,
                ],
            )

            console.log(
                `Direct storage: Learning path '${learningPath.title}' saved successfully`,
            )
            return {
                success: true,
                pathId: learningPath.id,
                message: `Learning path '${learningPath.title}' saved successfully`,
            }
        } catch (error) {
            console.error('Direct storage save error:', error)
            throw error
        }
    }

    async getLearningPath(pathId) {
        const db = await this.connect()

        try {
            const row = await db.get(
                'SELECT * FROM learning_paths WHERE id = ?',
                [pathId],
            )

            if (!row) {
                return {
                    success: false,
                    message: `Learning path '${pathId}' not found`,
                }
            }

            const curriculum = JSON.parse(row.curriculum)
            const tags = JSON.parse(row.tags)

            return {
                success: true,
                metadata: {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    difficulty: row.difficulty,
                    totalDuration: row.total_duration,
                    moduleCount: row.module_count,
                    status: row.status,
                    domain: row.domain,
                    tags: tags,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                },
                learningPath: curriculum,
            }
        } catch (error) {
            console.error('Direct storage get error:', error)
            throw error
        }
    }

    async listLearningPaths(filters = {}) {
        const db = await this.connect()

        try {
            let query = 'SELECT * FROM learning_paths WHERE 1=1'
            const params = []

            if (filters.difficulty) {
                query += ' AND difficulty = ?'
                params.push(filters.difficulty)
            }

            if (filters.domain) {
                query += ' AND domain = ?'
                params.push(filters.domain)
            }

            if (filters.status) {
                query += ' AND status = ?'
                params.push(filters.status)
            }

            query += ' ORDER BY created_at DESC'

            if (filters.limit) {
                query += ' LIMIT ?'
                params.push(parseInt(filters.limit))
            }

            const rows = await db.all(query, params)

            const paths = rows.map((row) => {
                const curriculum = JSON.parse(row.curriculum)
                const tags = JSON.parse(row.tags)

                return {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    difficulty: row.difficulty,
                    totalDuration: row.total_duration,
                    moduleCount: row.module_count,
                    status: row.status,
                    domain: row.domain,
                    tags: tags,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                    curriculum: curriculum,
                }
            })

            console.log(
                `Direct storage: Retrieved ${paths.length} learning paths`,
            )
            return {
                success: true,
                count: paths.length,
                totalStored: rows.length,
                paths: paths,
            }
        } catch (error) {
            console.error('Direct storage list error:', error)
            throw error
        }
    }

    async updateLearningPath(pathId, updates) {
        const db = await this.connect()

        try {
            const updateFields = []
            const params = []

            if (updates.status) {
                updateFields.push('status = ?')
                params.push(updates.status)
            }

            if (updates.title) {
                updateFields.push('title = ?')
                params.push(updates.title)
            }

            if (updates.description) {
                updateFields.push('description = ?')
                params.push(updates.description)
            }

            updateFields.push('updated_at = ?')
            params.push(new Date().toISOString())

            params.push(pathId)

            const query = `UPDATE learning_paths SET ${updateFields.join(
                ', ',
            )} WHERE id = ?`

            const result = await db.run(query, params)

            if (result.changes === 0) {
                return {
                    success: false,
                    message: `Learning path '${pathId}' not found`,
                }
            }

            console.log(
                `Direct storage: Learning path '${pathId}' updated successfully`,
            )
            return {
                success: true,
                message: `Learning path updated successfully`,
            }
        } catch (error) {
            console.error('Direct storage update error:', error)
            throw error
        }
    }

    async close() {
        if (this.db) {
            await this.db.close()
            this.db = null
        }
    }
}

export const directStorage = new DirectStorage()
