class StringBuilder {
  value: string = "";

  constructor(value?:string){
      this.value = value||"";
  }

  public append(object) {
    if (!object) return;
    this.value += object.toString();
  }

  toString(){
      return this.value;
  }
}
export default StringBuilder;
