const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .get('/hello?name=Carlos')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Carlos');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send( { surname: "Colombo" } )
        .end(function (err, res) {
          assert.equal( res.status, 200, 'Estado OK de la solicitud' );
          assert.equal( res.type, 'application/json', 'Tipo de solicitud' );
          assert.equal( res.body.name, 'Cristoforo', 'Nombre del cuerpo de la solicitud' );
          assert.equal( res.body.surname, 'Colombo' );
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .put( '/travellers' )
        .send( { surname: "da Verrazzano" } )
        .end( ( req, res )=>{
          assert.equal( res.status, 200, 'Estado de la solicutd' );
          assert.equal( res.type, 'application/json', 'Tipo de solicitud' );
          assert.equal( res.body.name, 'Giovanni', 'Parametros del cuerpo de la solicitud' );
          assert.equal( res.body.surname, 'da Verrazzano', 'Parametros del cuerpo de la solicitud' );
        });
      done();
    });
  });
});

const Browser = require('zombie');
Browser.site = "https://lwubkw-3000.preview.csb.app/";

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);

  const browser = new Browser();

  suiteSetup( 'Ruta para el navegador', (done)=>{
    return browser.visit('/', done);
  });

  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill( 'surname', 'Colombo' )
        .then( ()=>{

          browser.pressButton( 'submit', ()=>{

            browser.assert.success();
            browser.assert.text( 'span#name', 'Cristoforo' );
            browser.assert.text( 'span#surname', 'Colombo' );
            browser.assert.elements( 'span#dates', 1 );

          });

        });
      done();
    });
    // #6
    /*test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill( 'surname', 'Vespucci' )
        .then( ()=>{
          browser.pressButton( 'submit', ()=>{

            browser.assert.success();
            browser.assert.text( 'span#name', 'Cristoforo' );
            browser.assert.text( 'span#surname', 'Vespucci' );
            browser.assert.elements( 'span#dates', 1 );

          });
        });

      done();
    });*/
  });
});
