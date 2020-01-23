import { PipeTransform,Pipe } from "@angular/core";
@Pipe({
    name:'searchFilter'
})
export class SearchFilterPipe implements PipeTransform{
    public tempArray = [];
    transform(data:any,val:any){
        if(!val || val==undefined || !data){
            return data;
        }else{
            this.tempArray = [];
            data.forEach(element => {
                if(element.name.toLowerCase().includes(val.toLowerCase())){
                    this.tempArray.push(element);
                }
            });
            return this.tempArray;
        }
    }
}