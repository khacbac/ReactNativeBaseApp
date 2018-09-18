import * as React from "react";
export default class LifeComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> { 
  
    public isMouted: boolean;
  
    constructor(props){
      super(props);
      this.isMouted = false;
    }
  
    componentDidMount(){
      this.isMouted = true;
      // console.log('Chung componentDidMount');
    }
  
    componentWillUnmount(){
      this.isMouted = false;
      // console.log('Chung componentWillUnmount');
    }

    protected setUnmount(){
      this.isMouted = false;
    }

    setState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
        callback?: () => void
    ): void{
      // console.log('Chung this.isMouted setState', this.isMouted, state);
        if(this.isMouted){
            super.setState(state, callback);
        }
    }
  }