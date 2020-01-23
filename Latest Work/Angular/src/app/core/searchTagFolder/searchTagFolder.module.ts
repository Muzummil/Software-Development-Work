
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { SearchTagFolderComponent } from './searchTagFolder.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
        ElementBlockModule],
    declarations: [SearchTagFolderComponent],
    providers: [],
    exports: [SearchTagFolderComponent]
})

export class SearchTagFolderModule {

}
