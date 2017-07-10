/* eslint no-new:0*/
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use(chaiAsPromised)

const SCSBRestClient = require('../scsb_rest_client.js')

describe('SCSBRestClient', function () {
  describe('Constructor', () => {
    it('shoould throw an exception if instaniated without an API Key', function () {
      expect(function () { new SCSBRestClient({url: 'https://example.com'}) }).to.throw(Error, 'SCSBRestClient must be instaniated with a url and apiKey')
    })

    it('should throw exception if instaniated without a URL', function () {
      expect(function () { new SCSBRestClient({apiKey: 'keepitlikeasecret'}) }).to.throw(Error, 'SCSBRestClient must be instaniated with a url and apiKey')
    })
  })

  describe('addRequestItem function', () => {
    const scsbClient = new SCSBRestClient({ apiKey: 'keepitlikeasecret', url: 'https://example.com' })

    it('Should reject a promise if the data parameter is NULL', () => {
      const addRequestItemPromise = scsbClient.addRequestItem(null)
      return assert.isRejected(addRequestItemPromise, 'the data parameter is empty or undefined; could not initialize POST request')
    })

    it('Should reject a promise if the data parameter is UNDEFINED', () => {
      const addRequestItemPromise = scsbClient.addRequestItem(undefined)
      return assert.isRejected(addRequestItemPromise, 'the data parameter is empty or undefined; could not initialize POST request')
    })

    it('Should reject a promise if the data parameter is an EMPTY Object', () => {
      const addRequestItemPromise = scsbClient.addRequestItem({})
      return assert.isRejected(addRequestItemPromise, 'the data parameter is empty or undefined; could not initialize POST request')
    })

    it('Should reject a promise due to incorrect API_KEY and API_URL', () => {
      const dummyObject = {
        patronBarcode: '234567890987654',
        itemBarcodes: [ '32101058075084' ],
        requestType: 'RETRIEVAL',
        deliveryLocation: 'NH'
      }
      const addRequestItemPromise = scsbClient.addRequestItem(dummyObject)

      return addRequestItemPromise.should.be.rejected.and.should.eventually.include({
        'errorMessage': 'An error occurred while sending the POST request to the SCSB API',
        'statusCode': 404
      });
    })
  })
})
