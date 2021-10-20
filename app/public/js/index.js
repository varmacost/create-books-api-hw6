const SomeApp = {
    data() {
      return {
        students: [],
        selectedStudent: null,
        books: [],
        bookForm: {},
        selectedBook: null
      }
    },
    computed: {},
    methods: {
        prettyData(d) {
            return dayjs(d)
            .format('D MMM YYYY')
        },
        prettyDollar(n) {
            const d = new Intl.NumberFormat("en-US").format(n);
            return "$ " + d;
        },
        selectStudent(s) {
            if (s == this.selectedStudent) {
                return;
            }
            this.selectedStudent = s;
            this.books = [];
            this.fetchBookData(this.selectedStudent);
        },
        fetchStudentData() {
            fetch('/api/student/')
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.students = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
        },
        fetchBookData(s) {
            console.log("Fetching book data for ", s);
            fetch('/api/book/?student=' + s.id)
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.books = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
            .catch( (error) => {
                console.error(error);
            });
        },
        postBook(evt) {
          if (this.selectedBook === null) {
              this.postNewBook(evt);
          } else {
              this.postEditBook(evt);
          }
        },
        postNewBook(evt) {
          this.bookForm.studentId = this.selectedStudent.id;
  
          console.log("Creating!", this.bookForm);
  
          fetch('api/book/create.php', {
              method:'POST',
              body: JSON.stringify(this.bookForm),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.books = json;
  
              // reset the form
              this.resetBookForm();
            });
        },
        postEditBook(evt) {
          this.bookForm.studentId = this.selectedStudent.id;
          this.bookForm.id = this.selectedBook.id;
  
          console.log("Updating!", this.bookForm);
  
          fetch('api/book/update.php', {
              method:'POST',
              body: JSON.stringify(this.bookForm),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.books = json;
  
              // reset the form
              this.resetBookForm();
            });
        },
        selectBookToEdit(o) {
            this.selectedBook = o;
            this.bookForm = Object.assign({}, this.selectedBook);
        },
        resetBookForm() {
            this.selectedBook = null;
            this.bookForm = {};
        }
    },
    created() {
        this.fetchStudentData();
    }
  
  }
  
  Vue.createApp(SomeApp).mount('#bookApp');
