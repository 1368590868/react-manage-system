/*global API*/
import { request } from '@@/plugin-request'
const url = 'http://127.0.0.1:3000/api'
/** 获取所有文章 */
export class ArticleService {
    static async getArticleList(
        params: {
            // query
            /** 当前的页码 */
            current?: number;
            /** 页面的容量 */
            pageSize?: number;
            tags?: string
        },
        options?: { [key: string]: any },
    ) {

        return request<API.ApiResponse<API.ArticleList>>(`${url}/getArticleList`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
                page: params.current,
                pageSize: params.pageSize,
                tags: params.tags ? [params.tags] : []
            },
            ...(options || {}),
        });
    }

    // 获取tag列表
    static async getTagList() {
        return request<API.ApiResponse<API.TagList>>(`${url}/getTag`, {

            method: 'GET'
        });
    }
}
