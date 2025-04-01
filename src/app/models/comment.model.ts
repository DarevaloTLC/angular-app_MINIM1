export interface Comment {
    _id?: string;
    text: string;
    user: string;
    packet: string;
    createdAt?: Date;
    seleccionado?: boolean; // Propiedad para controlar la selección del comentario
    editing?: boolean; // Propiedad para habilitar el modo de edición
    originalContent?: string; // Almacena el contenido original del comentario antes de editar

}
export class Comment implements Comment {
    constructor() {
        this.seleccionado = false; // Inicializa la propiedad seleccionado en false
    }
}