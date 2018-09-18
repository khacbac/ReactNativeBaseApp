export default class PaddingMap {
    public top = 0;
    public right = 0;
    public bottom = 0;
    public left = 0;
  
    constructor(top?: number, right?: number, bottom?: number, left?: number) {
      this.top = top || 0;
      this.right = right || 0;
      this.bottom = bottom || 0;
      this.left = left || 0;
    }
  
    public stringify() {
      return {
        top: this.top,
        right: this.right,
        bottom: this.bottom,
        left: this.left
      };
    }
  }