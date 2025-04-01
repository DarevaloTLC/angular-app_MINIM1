import { Comment } from './../models/comment.model';
import { CommentService } from './../services/comment.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule, MatPaginatorModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  ngOnInit(): void {
    this.obtenerComentarios();
}

commentSeleccionado: Comment = new Comment(); // Almacena el comentario seleccionado
commentList: Comment[] = []; // Lista completa de comentarios
displayedComments: Comment[] = []; // Comentarios visibles en la página actual
totalItems = 0; // Número total de elementos
itemsPerPage = 3; // Elementos por página
currentPage = 0; // Página actual
mostrarModal = false; // Controla la visibilidad del modal

constructor(private cdr: ChangeDetectorRef) {
  this.commentList = [];
}

commentService = inject(CommentService);

obtenerComentarios(): void {
  this.commentService.getComments(this.currentPage + 1, this.itemsPerPage).subscribe({
    next: (response) => {
      this.commentList = response.data.map((comment: any) => ({
        ...comment,
        seleccionado: false // Inicializa la propiedad seleccionado en false
      }));
      this.displayedComments = this.commentList; // Actualiza los comentarios mostrados
      this.totalItems = response.totalComments;
      console.log(this.commentList, this.totalItems);
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al obtener comentarios:', error);
    }
  });
}

onPageChange(event: PageEvent) {
  this.currentPage = event.pageIndex;
  this.itemsPerPage = event.pageSize;
  this.obtenerComentarios(); // Llama a la función para obtener los comentarios de la nueva página
}
trackByCommentId(index: number, comment: any): string {
  return comment?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
}
toggleSeleccion(comment: Comment): void {
  // Cambia el estado de selección del comentario
  comment.seleccionado = !comment.seleccionado;
  console.log(comment.seleccionado);
}

confirmarEliminacion(): void {
  const comentariosSeleccionados = this.commentList.filter(comment => comment.seleccionado);
  if (comentariosSeleccionados.length === 0) {
    alert('No hay comentarios seleccionados para eliminar.');
    return;
  }

  const confirmacion = confirm('¿Estás seguro de que deseas eliminar los comentarios seleccionados?');
  if (confirmacion) {
    this.eliminarComentarios(comentariosSeleccionados);
  }
}

eliminarComentarios(comentariosSeleccionados: any[]): void {
  comentariosSeleccionados.forEach(comment => {
    this.commentService.deleteComment(comment._id).subscribe({
      next: () => {
        console.log('Comentario eliminado:', comment._id);          
        this.commentList = this.commentList.filter(c => c._id !== comment._id); // Filtra el comentario eliminado
      },
      error: (error) => {
        console.error('Error al eliminar el comentario:', error);
      }
    });
  });
}

cerrarModal(): void {
  this.mostrarModal = false; // Cambia el estado de visibilidad del modal
}

enableEdit(comment: Comment): void {
  comment.editing = true; // Habilita el modo de edición para el comentario
  comment.originalContent = comment.text; // Almacena el contenido original
}

saveEdit(comment: Comment): void {
  if (!comment.text || comment.text.trim() === '') {
    alert('El texto del comentario no puede estar vacío.');
    return;
  }

  if (!comment._id) {
    console.error('El comentario no tiene un ID válido.');
    alert('No se puede actualizar el comentario porque no tiene un ID válido.');
    return;
  }

  const updatedComment = { text: comment.text }; // Solo enviamos el campo que se va a actualizar

  this.commentService.updateComment(comment._id, updatedComment).subscribe({
    next: (updatedData) => {
      console.log('Comentario actualizado:', updatedData);
      comment.editing = false; // Desactiva el modo de edición
    },
    error: (error) => {
      console.error('Error al actualizar el comentario:', error);
      alert('Hubo un error al actualizar el comentario. Por favor, inténtalo de nuevo.');
    }
  });
}

cancelEdit(comment: Comment): void {
  if (comment.originalContent !== undefined) {
    comment.text = comment.originalContent; // Restaura el texto original del comentario
  }
  comment.editing = false; // Desactiva el modo de edición
}




}
