/*global API*/
import { request } from '@@/plugin-request';
const url = 'http://114.115.157.58:3002/api';
/** 获取所有文章 */
export class ArticleService {
  static async getArticleList(
    params: {
      // query
      /** 当前的页码 */
      current?: number;
      /** 页面的容量 */
      pageSize?: number;
      tags?: string;
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
        tags: params.tags ? [params.tags] : [],
      },
      ...(options || {}),
    });
  }

  // 保存文章
  static async saveArticle(data: API.ArticleDetail) {
    return request<API.ApiResponse<API.ArticleList>>(`${url}/addArticle`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      data,
    });
  }

  // 获取文章详情
  static async getArticleById(id: string) {
    return request<API.ApiResponse<API.ArticleDetail>>(`${url}/getArticleById/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
  }

  // 更新文章
  static async updateArticleById(id: string, data: API.ArticleDetail) {
    return request<API.ApiResponse<API.ArticleList>>(`${url}/updateArticle/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      data,
    });
  }

  // 图片上传
  static async uploadImage(file: any) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    return request<API.ApiResponse<API.ImageRes>>(`${url}/upload`, {
      method: 'POST',
      data: formData,
      requestType: 'blob',
    });
  }
}

export class TagsService {
  // 获取tag列表
  static async getTagList() {
    return request<API.ApiResponse<API.TagList[]>>(`${url}/getTag`, {
      method: 'GET',
    });
  }

  static async updateTagById(id: string, data: API.TagList) {
    return request<API.ApiResponse<API.TagList>>(`${url}/updateTag/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      data,
    });
  }

  static async addTag(data: API.TagList) {
    return request<API.ApiResponse<API.TagList>>(`${url}/addTag`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      data,
    });
  }

  static async deleteTagById(id: string) {
    return request<API.ApiResponse<API.TagList>>(`${url}/deleteTag/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
  }
}
