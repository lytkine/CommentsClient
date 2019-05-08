'use strict';

const e = React.createElement;

class CommentSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', body: ''};

    this.updateNameInput = this.updateNameInput.bind(this);
    this.updateBodyInput = this.updateBodyInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateNameInput(event){
      this.setState({name: event.target.value});
  }

  updateBodyInput(event){
      this.setState({body: event.target.value});
  }

  handleSubmit(){
      var data = JSON.stringify(this.state);
      this.setState({name:'', body: ''});

      fetch('https://comments-api.azurewebsites.net/api/Comments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: data
      })
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log(responseJson);
       listComponent.getcommentsfromapi();
     })
     .catch((error) => {
       console.error(error);
     });


  }

  render() {
     return e("div", null, e("div", {
        className: "formline"
      }, e("label", null, "Your Name:"), e("input", {
        type: "text",
        onChange: this.updateNameInput
      })), e("div", {
        className: "formline"
      }, e("label", null, "Your Comment:"), e("textarea", {
        onChange: this.updateBodyInput
      })), e("input", {
        type: "submit",
        value: "Send Comment",
        onClick: this.handleSubmit
      }));
  }
}

class CommentListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.items = [];
    this.getcommentsfromapi();
  }

  getcommentsfromapi() {
     return fetch('https://comments-api.azurewebsites.net/api/Comments')
     .then((response) => response.json())
     .then((responseJson) => {
       this.items = responseJson.reverse();
       ReactDOM.render(e(CommentListContainer), listContainer);
       return responseJson;
     })
     .catch((error) => {
       console.error(error);
     });
  }

  render() {
    return e(
      "div",
      {className: "commentlistholder"}, 
      this.items.map((item, index) => e("div", {"data-commentid": item.id, className:"singlecomment"}, e("label", null, item.name), e("div", null, item.body)))
    );
  }
}


const subContainer = document.querySelector('#commentpanel');
ReactDOM.render(e(CommentSubmit), subContainer);

const listContainer = document.querySelector('#clist');
var listComponent = ReactDOM.render(e(CommentListContainer), listContainer);