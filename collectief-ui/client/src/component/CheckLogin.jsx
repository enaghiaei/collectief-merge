import Cookies from 'universal-cookie';
var value;

class CheckLogin {
    
    constructor() {
      
    }

    componentDidMount(){
      this.is_login();
      
    }
  
    is_login() {
  
      const cookies = new Cookies();
      var token = cookies.get('token');
  
      if(token != ""){
      var credentials = {token:token};
      console.log(credentials);
      return fetch('http://'+global.config.vals.root.ip+':3001/is_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
        .then(data => data.json())
        .then(
          (result) => {
            /*this.setState({
              isLoaded: true,
              items: result.items
            });*/
            console.log(result);
            console.log("message="+result.message);
            if(result.message === 1){   
  
              return true;                 
              
            }
            else if(result.message === 0){
  
              console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                const cookies = new Cookies();
                cookies.remove('token'); 
                window.location.href = "/";      
                return false;
              
  
            }
            console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    
            //if(result.message == "1")
            //  window.location.href = "/dashboard";
    
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            return true;
          }
        )
      }else{
        return true;
      }
        
     }
  

    check_token(){

      const cookies = new Cookies();

      var token = cookies.get('token');
     
      if(!token){

        return false;
        
      }

      return true;

    }

    
  }
  export default CheckLogin;