import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import Navbar from "./Navbar";
import BookCard from "../Bookcard";
import { Row } from "react-bootstrap";
import firebase from '../../config/firebaseConfig';
const firestore = firebase.firestore();

class SearchBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      searchTerm: undefined,
      searchData: undefined,
      page: this.props.match.params.page,
      books: {}
    };
  }

  componentDidMount() {
    this.setState({ page: this.props.match.params.page });
    const books = [];
    firestore.collection('books').get().then((snapshot)=> {
      snapshot.docs.forEach(item => {
        console.log(item.data());
        books.push(item.data())
      })
    }).then(()=>{
      this.setState({books});
      console.log(this.state);
    });
        
  }

  handleChange = e => {
    let value = e.target.value;
    this.setState({ searchTerm: value }, () => {
      this.searchBooks();
    });
  };

  onSubmit(e) {
    e.preventDefault();
  }
  async searchBooks() {
    if (this.state.searchTerm) {
      let url = null;
      let api = "https://www.googleapis.com/books/v1/volumes/?q=";
      let page = this.state.page;
      if (page === 0 || page === undefined) {
        url = api + this.state.searchTerm + "&startIndex=0&maxResults=20";
      } else {
        url =
          api +
          this.state.searchTerm +
          "&startIndex=" +
          page * 20 +
          "&maxResults=20";
      }
      try {
        const response = await axios.get(url);
        console.log(response);
        this.setState({ searchData: response.data });
      } catch (e) {
        console.log(e);
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState !== undefined &&
      nextProps.match.params.page !== prevState.page
    ) {
      return { page: nextProps.match.params.page };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.searchBooks();
    }
  }
  render() {
    let body = null;
    let bookCards = null;
    let nextPage;
    let previousPage;
    let currPage = this.state.page;

    if (this.state.searchData) {
      if (currPage > 0) {
        previousPage = <Link to={`${parseInt(currPage) - 1}`}>Previous</Link>;
      }
      nextPage = <Link to={`${parseInt(currPage) + 1}`}>Next</Link>;
    }
    bookCards =
      this.state.searchData &&
      this.state.searchData.items.map(book => {
        // let book = books.book;

        return <BookCard key={book.id} book={book} />;
      });

    body = (
      <div style={{ padding: "10px", margin: "20px" }}>
        <form method="POST" name="formName" onSubmit={this.onSubmit}>
          <label>
            {" "}
            <div
              style={{
                backgroundColor: "#007bff",
                color: "white",
                "font-size": "20px"
              }}
            >
              Search Here
            </div>
            <input
              style={{ margin: "0", width: "400px", height: "50px" }}
              type="text"
              name="searchTerm"
              onChange={this.handleChange}
            />
          </label>
        </form>
        <Row>{bookCards}</Row>
        {previousPage}
        {nextPage}
      </div>
    );

    return body;
  }
}

export default SearchBooks;
