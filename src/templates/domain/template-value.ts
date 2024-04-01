import {v4 as uuid} from 'uuid'
import { TemplateEntity } from "./template-entity";

export class TemplateValue implements TemplateEntity{
    id: string;
    data: string;
    
    constructor({
        data
    }: {
        data:string
    }){
        this.id = uuid();
        this.data = data;
    }
}