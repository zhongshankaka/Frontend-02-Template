
var assert = require('assert');
import { add } from '../add'

describe("add funtion testing", function(){
    it('1 + 2 should be 3', function() {
        assert.equal(add(1, 2), 3);
      });
})