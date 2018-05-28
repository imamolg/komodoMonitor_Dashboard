import React, {Component} from 'react';
import { Container, Row, Col } from 'reactstrap';
import '../App.css';

class Header extends Component{
  constructor(props){
    super(props);
    this.state = {

    }

  }
  render()
  {

      return (

        <div className="Header">
        <Container >
          <Row>
              <Col sm={10}>
                  <img src={require('./komodo.png')} alt="Komodo Monitr" width="40" height="40" />
                  <span className="BrandName">KOMODO </span><span className="SubBrand">MONITR</span>

              </Col>

                <Col sm={2}>


                    <div style={{ textAlign: 'center' }}>
                      {this.props.view === "profile" &&
                      <img className="profile" src={this.props.playerImage} alt="" height="80" width="80"  />}
                      {this.props.view !== "profile" &&

                      <a onClick={this.props.changeProfile}><img className="profile" src={this.props.playerImage} alt="" height="80" width="80" /></a>}
                      <a onClick={this.props.logout} className="logout">Logout</a>


                    </div>

                </Col>

            </Row>

        </Container>
        </div>
      );
    }
}

export default Header;
