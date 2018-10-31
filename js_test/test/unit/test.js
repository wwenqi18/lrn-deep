var expect = chai.expect;
var assert = chai.assert;


describe("compile", function() {
	
	it("validate compile", function() {
		
		ans = '\"\"\"The Deep Learning [first_network] model, powered by LrnDeep\"\"\"\n\n' +
				'## Load the keras library\n' +
				'import keras\n' +
				'import numpy as np\n' +
				'from keras.utils import np_utils\n\n' +
				'## Load the dataset\n' +
				'from keras.datasets import mnist\n\n' +
				'(x_train, y_train), (x_test, y_test) = mnist.load_data()\n' +
				'X_train = x_train.reshape(x_train.shape[0], 28 * 28)\n' +
				'X_test = x_test.reshape(x_test.shape[0], 28 * 28)\n' +
				'X_train = X_train.astype(\'float32\')\n' +
				'X_test = X_test.astype(\'float32\')\n' +
				'X_train /= 255\n' +
				'X_test /= 255\n' +
				'Y_train = np_utils.to_categorical(y_train, 10)\n' +
				'Y_test = np_utils.to_categorical(y_test, 10)\n\n\n' +
				'## Build the model\n' +
				'from keras.models import Sequential\n' +
				'from keras.layers import Dense, Activation\n\n' +
				'model = Sequential()\n' +
				'model.add(Dense(128, input_dim = 784))\n' +
				'model.add(Activation(\'sigmoid\'))\n' +
				'model.add(Dense(10))\n' +
				'model.add(Activation(\'softmax\'))\n' +
				'model.compile(loss=\'categorical_crossentropy\', optimizer=\'adam\', metrics=[\'accuracy\'])\n\n\n' +
				'## Training and evaluation\n' +
				'model.fit(X_train, Y_train, epochs=10, batch_size=32)\n' +
				'score = model.evaluate(X_test, Y_test, batch_size=128)\n'

		network = [{"name": "FC", "output_shape": 128}, {"name": "Sigmoid"}, {"name": "FC", "output_shape": 10}];
		network_name = "first_network";
		assert.equal(compile(network, network_name), ans);
	});

});
