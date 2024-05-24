import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Form, Button} from "react-bootstrap";

function NavigationBar(){
    return (
		<Navbar bg="primary" data-bs-theme="dark">
        <Container >
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/img/film-solid.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Film Library
          </Navbar.Brand>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/img/user-regular.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export {NavigationBar};