import { Container, Navbar, Nav } from "react-bootstrap";

const HeaderNavLink = (props: { title: string; toHref: string }) => {
  const { title, toHref } = props;

  return (
    <Nav.Link className="text-white" href={toHref}>
      <span className="hover:text-primary font-plain text-sm">
        {title.toUpperCase()}
      </span>
    </Nav.Link>
  );
};

const TheHeader = () => {
  return (
    <Navbar bg="black" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>
          <span className="text-3xl font-bold text-white">Woxsen League</span>
        </Navbar.Brand>
        <Nav
          className="ms-auto gap-x-12"
          style={{ justifyContent: "flex-end" }}
        >
          <HeaderNavLink title="home" toHref="#" />
          <HeaderNavLink title="about" toHref="#" />
          <HeaderNavLink title="events" toHref="#" />
          <HeaderNavLink title="facilities" toHref="#" />
          <HeaderNavLink title="booking" toHref="#" />
          <HeaderNavLink title="pro shop" toHref="#" />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TheHeader;
