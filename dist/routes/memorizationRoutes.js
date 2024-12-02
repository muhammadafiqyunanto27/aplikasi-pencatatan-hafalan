"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: "postgres.sihrjqgjgxvwxfrnxnmz",
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'postgres',
    password: 'apaansih1727',
    port: 5432,
});
const router = (0, express_1.Router)();
// Create new record
router.post('/hafalan', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surah_from, ayat_from, surah_to, ayat_to, status } = req.body;
        const query = `
      INSERT INTO memorization_records 
      (name, surah_from, ayat_from, surah_to, ayat_to, status) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
        const values = [name, surah_from, ayat_from, surah_to, ayat_to, status];
        const result = yield pool.query(query, values);
        res.json({ status: 'success', data: result.rows[0] });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}));
// Get all records
router.get('/hafalan', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT * FROM memorization_records ORDER BY created_at DESC');
        res.json({ status: 'success', data: result.rows });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}));
// Get single record
router.get('/hafalan/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield pool.query('SELECT * FROM memorization_records WHERE id = $1', [id]);
        res.json({ status: 'success', data: result.rows[0] });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}));
// Update record
router.put('/hafalan/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = yield pool.query('UPDATE memorization_records SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, id]);
        res.json({ status: 'success', data: result.rows[0] });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}));
// Delete record
router.delete('/hafalan/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield pool.query('DELETE FROM memorization_records WHERE id = $1', [id]);
        res.json({ status: 'success', message: 'Record deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}));
exports.default = router;
