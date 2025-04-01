import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(private http: HttpClient) { }

    private apiUrl = "http://localhost:4000/api/comments";

    getComments(page: number = 1, limit: number = 3): Observable<{ data: Comment[]; totalComments: number; currentPage: number }> {
        return this.http.get<{ data: Comment[]; totalComments: number; currentPage: number }>(
            `${this.apiUrl}?page=${page}&limit=${limit}`
        );
    }

    getComment(id: string): Observable<Comment> {
        return this.http.get<Comment>(this.apiUrl + "/" + id);
    }

    createComment(commentData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, commentData);
    }

    deleteComment(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`); // Llamada DELETE para eliminar un comentario
    }

    updateComment(id: string, commentData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, commentData); // Llamada PUT para actualizar un comentario
    }


}