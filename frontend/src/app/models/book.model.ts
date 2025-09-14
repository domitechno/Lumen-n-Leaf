export class Books {

 id: number = -1;
 title: string = "Book";
 cover_url: string = "assets/img/snoopy.jpg";
 author: string = "";
 author_name?: string;
 description: string = "Résumé du livre";
 genre_id?: number; 
 genre_name?: string;
 genre_image?: string;
 category_id: number = 1;
 category_name?: string;
 category_color?: string;

 copy(): Books {
    return Object.assign(new Books(), this);
 }
}