import express, { Request, Response } from 'express';
import { codesePool, query } from '../configs/database.config';
const router = express.Router();

router.get('/api/chart_data', async (req: Request, res: Response) => {
  const { code } = req.body;
  const sql = `select * from ${code} `;
  const result = await query(codesePool, sql);
  res.send({
    response_status: 1,
    message: `Get ${code} chart data successful.`,
    data: {
      total: result.length,
      result,
    },
  });
});

export { router as chartDataRouter };
