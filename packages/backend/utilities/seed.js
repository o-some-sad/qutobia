// dummy objects for testing
const books = [
    {
      title: "JavaScript: The Good Parts",
      author: ["Douglas Crockford"],
      price: 29.99,
      description: "A deep dive into the best features of JavaScript.",
      stock: 10,
      image: "https://example.com/javascript-good-parts.jpg",
    },
    {
      title: "Clean Code",
      author: ["Robert C. Martin"],
      price: 35.5,
      description: "A guide to writing clean, maintainable code.",
      stock: 5,
      image: "https://example.com/clean-code.jpg",
    },
    {
      title: "You Don’t Know JS",
      author: ["Kyle Simpson"],
      price: 25.0,
      description: "A comprehensive book series on JavaScript's inner workings.",
      stock: 15,
      image: "book-cover-you-dont-know-js.png",
    },
  ];
  
  const users = [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "securepassword123",
      role: "admin",
      image: "https://example.com/john-doe.jpg",
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "mypassword456",
      role: "user",
      image: "profile-pic-jane.png",
    },
    {
      name: "Alice Brown",
      email: "alicebrown@example.com",
      password: "aliceSecure789",
      role: "user",
      image: null,
    },
  ];
  
  const reviews = [
    {
      user: "65f3c9a2b6e7d1001c3a4f5b", // Example ObjectId for a user
      book: "65f3c9d4b6e7d1001c3a4f5c", // Example ObjectId for a book
      rating: 9,
      review: "An amazing book that provides deep insights into JavaScript!",
    },
    {
      user: "65f3c9e5b6e7d1001c3a4f5d",
      book: "65f3c9f6b6e7d1001c3a4f5e",
      rating: 7,
      review:
        "Good book overall, but some concepts were a bit challenging to grasp.",
    },
    {
      user: "65f3ca07b6e7d1001c3a4f5f",
      book: "65f3ca18b6e7d1001c3a4f60",
      rating: 10,
      review: "One of the best books I have ever read. Highly recommended!",
    },
  ];
  
  const carts = [];
  
  const orders = [];