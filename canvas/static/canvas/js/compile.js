function compile(network, network_name){
  /* Compile the neural network architecture into Keras code

  Args:
    network: network layers, an array of javascipt objects
    network_name: the name of the neural network, a string 

  Returns:
    code_keras: the keras code for network, a string 
  */

  var code_start = '\"\"\"The Deep Learning [' + network_name + '] model, ';
  code_start += 'powered by LrnDeep\"\"\"\n\n';
  code_start += "## Load the keras library\n"
  code_start += "import keras\nimport numpy as np\n";
  code_start += "from keras.utils import np_utils\n\n";

  // TODO: other datasets, we import mnist for now 
  var code_dataset = ""
  code_dataset += "## Load the dataset\n"
  code_dataset += "from keras.datasets import mnist\n\n";
  code_dataset += "(x_train, y_train), (x_test, y_test) = mnist.load_data()\n";
  code_dataset += "X_train = x_train.reshape(x_train.shape[0], 28 * 28)\n";
  code_dataset += "X_test = x_test.reshape(x_test.shape[0], 28 * 28)\n";
  code_dataset += "X_train = X_train.astype('float32')\n"
  code_dataset += "X_test = X_test.astype('float32')\n"
  code_dataset += "X_train /= 255\n"
  code_dataset += "X_test /= 255\n"
  code_dataset += "Y_train = np_utils.to_categorical(y_train, 10)\n";
  code_dataset += "Y_test = np_utils.to_categorical(y_test, 10)\n\n\n";

  // loop over the network layers to build the model 
  var code_model = "";
  code_model += "## Build the model\n"
  code_model += "from keras.models import Sequential\n";
  code_model += "from keras.layers import Dense, Activation\n\n";
  code_model += "model = Sequential()\n";
  for (i = 0; i < network.length; i++) {
    if(network[i]["name"] == "FC") {
      code_model += "model.add(Dense(" + network[i]["output_shape"];
      if(i == 0) {
        code_model += ", input_dim = 784))\n";
      } else {
        code_model += "))\n";
      }
    } else if(network[i]["name"] == "Sigmoid") {
      code_model += "model.add(Activation('sigmoid'))\n";
    } else if(network[i]["name"] == "Tanh") {
      code_model += "model.add(Activation('tanh'))\n";
    } else {}
  }
  code_model += "model.add(Activation('softmax'))\n";
  code_model += "model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])\n\n\n"

  // train the model 
  var code_end = "";
  code_end += "## Training and evaluation\n"
  code_end += "model.fit(X_train, Y_train, epochs=10, batch_size=32)\n"
  code_end += "score = model.evaluate(X_test, Y_test, batch_size=128)\n"

  // combine all codes 
  var code_keras = code_start + code_dataset + code_model + code_end;
  return code_keras
}

// Example
// network = [{"name": "FC", "output_shape": 128}, {"name": "Sigmoid"}, {"name": "FC", "output_shape": 10}];
// network_name = "first_network"
// codes = compile(network, network_name)

// console.log(codes)