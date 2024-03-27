import { Request, Response } from 'express'

export const tuningJobsListCtrl = async (req: Request, res: Response) => {
    const api_key = process.env.API_KEY

    try {
        const resp = await fetch('https://api.openai.com/v1/fine_tuning/jobs?limit=2', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
        })
        const fineTune = await resp.json()

        return res.json({
            msg: 'api/ai tuning list',
            data: fineTune
        })
    } catch (error) {
        res.status(400).json(error)
    }
}