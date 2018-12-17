function compile(network, net_config){
  /* Compile the neural network architecture into Keras code

  Args:
    network: network layers, an array of javascipt objects
    net_config: the configuration of the neural network, an array 

  Returns:
    code_keras: the keras code for network, a string 
  */

  var code_start = code_init(net_config["name"])

  // TODO: other datasets, we import mnist for now 
  var code_dataset = prepare_dataset(net_config["dataset"], network[0]["name"])

  // if have not build the model, return the start code 
  if(network.length == 0) { return code_start + code_dataset}

  // loop over the network layers to build the model 
  var code_model = build_model(network, net_config)
  
  // train the model 
  var code_train = add_train()

  // combine all codes 
  var code_keras = code_start + code_dataset + code_model + code_train;
  return code_keras;
}

function code_init(network_name){
  var code_start = '\"\"\"The Deep Learning [' + network_name + '] model, ';
  code_start += 'powered by LrnDeep\"\"\"\n\n';
  code_start += "## Load the keras library\n";
  code_start += "import keras\nimport numpy as np\n";
  code_start += "from keras.utils import np_utils\n\n";
  return code_start;
}

function prepare_dataset(dataset, first_layer){
  code_dataset = "";
  code_dataset += "## Load the dataset\n";

  if(dataset == "mnist") {  
    code_dataset += "from keras.datasets import mnist\n\n";
    code_dataset += "(X_train, Y_train), (X_test, Y_test) = mnist.load_data()\n";

    if(first_layer == "FC"){
      code_dataset += "X_train = X_train.reshape(X_train.shape[0], 28 * 28)\n";
      code_dataset += "X_test = X_test.reshape(X_test.shape[0], 28 * 28)\n";
    }
    else if(first_layer == "CNN") {
      code_dataset += "X_train = X_train.reshape(X_train.shape[0], 28, 28, 1)\n";
      code_dataset += "X_test = X_test.reshape(X_test.shape[0], 28, 28, 1)\n";
    }
    code_dataset += "X_train = X_train.astype('float32') / 255\n";
    code_dataset += "X_test = X_test.astype('float32') / 255\n";

    code_dataset += "Y_train = np_utils.to_categorical(Y_train, 10)\n";
    code_dataset += "Y_test = np_utils.to_categorical(Y_test, 10)\n\n\n";
  }
  else if(dataset == "cifar10") {
    code_dataset += "from keras.datasets import cifar10\n\n";
    code_dataset += "(X_train, Y_train), (X_test, Y_test) = cifar10.load_data()\n";

    if(first_layer == "FC"){
      code_dataset += "X_train = X_train.reshape(X_train.shape[0], 3 * 32 * 32)\n";
      code_dataset += "X_test = X_test.reshape(X_test.shape[0], 3 * 32 * 32)\n";
    }
    else if(first_layer == "CNN") {
      // nothing to do 
    }

    code_dataset += "X_train = X_train.astype('float32') / 255\n";
    code_dataset += "X_test = X_test.astype('float32') / 255\n";

    code_dataset += "Y_train = np_utils.to_categorical(Y_train, 10)\n";
    code_dataset += "Y_test = np_utils.to_categorical(Y_test, 10)\n\n\n";
  }
  else if(dataset == "imdb") {
    code_dataset += "from keras.datasets import imdb\n";
    code_dataset += "from keras.preprocessing import sequence\n\n"
    code_dataset += "(X_train, Y_train), (X_test, Y_test) = imdb.load_data(num_words=20000)\n";
    code_dataset += "X_train = sequence.pad_sequences(X_train, maxlen=80)\n"
    code_dataset += "X_test = sequence.pad_sequences(X_test, maxlen=80)\n\n"
  }
  return code_dataset;
}

function build_model(network, net_config){
  var code_model = "";
  code_model += "## Build the model\n";
  code_model += "from keras.models import Sequential\n";
  code_model += scan_layers(network)
  code_model += "model = Sequential()\n"; // Only support sequential models for now

  input_shape = get_input_shape(network[0]["name"], net_config["dataset"])

  for (i = 0; i < network.length; i++) {
    if(network[i]["name"] == "FC") {
      if(i != 0) {
        input_shape = 0;
        if(cnn_in_prev(network, i) == true) code_model += add_flatten();
      }
      code_model += add_dense(input_shape, network[i]["output_shape"]); 
    }
    
    else if(network[i]["name"] == "CNN") {
      if(i != 0) input_shape = 0;
      code_model += add_cnn(input_shape, network[i]);
    }

    else if(network[i]["name"] == "LSTM") {
      if(i == 0) code_model += add_embedding(net_config["dataset"]);
      if(network[i + 1]["name"] == "LSTM") code_model += add_lstm(network[i], false);
      else code_model += add_lstm(network[i], true);
    }

    else if(network[i]["name"] == "MaxPooling2D") {
      code_model += add_pooling(network[i]);
    }

    else if(network[i]["name"] == "batch_norm") {
      code_model += add_batch_norm();
    }

    else if(network[i]["name"] == "activation") {
      code_model += add_activation(network[i]["type"]);
    } 

    else {}
  }

  code_model += add_final_layer(net_config["dataset"]);

  return code_model;
}

function scan_layers(layers) {
  code_layers = "from keras.layers import Activation";
  layers_to_add = []
  for (i = 0; i < layers.length; i++)
  {
    l = ""
    if(layers[i]["name"] == "CNN") l = "Conv2D";
    else if(layers[i]["name"] == "MaxPooling2D") l = "MaxPooling2D"; 
    else if(layers[i]["name"] == "LSTM") l = "LSTM";
    else if(layers[i]["name"] == "FC") l = "Dense";
    else if(layers[i]["name"] == "batch_norm") l = "BatchNormalization";

    if(layers_to_add.includes(l) == false && l != "") {
      layers_to_add.push(l);
      if(l == "LSTM") layers_to_add.push("Embedding");
      if(l == "Conv2D") layers_to_add.push("Flatten");
    }
  }
  for (i = 0; i < layers_to_add.length; i++) {
    code_layers += ", " + layers_to_add[i];
  }
  return code_layers + "\n\n"
}

function cnn_in_prev(network, i){
  ret = false;
  for(j = 0; j < i; j++) {
    if(network[j]["name"] == "CNN") {
      ret = true;
      break;
    }
  }
  for(j = 0; j < i; j++) {
    if(network[j]["name"] == "FC") {
      ret = false;
      break;
    }
  }
  return ret;
}

function get_input_shape(first_layer, dataset) {
  if(dataset == "mnist") {
    if(first_layer == "FC") return 784; 
    else return [28, 28, 1]
  }
  else if(dataset == "cifar10") {
    if(first_layer == "FC") return 3072; 
    else return [32, 32, 3]
  }
}

function add_dense(input_shape, output_shape) {
  var code_dense = "";
  code_dense += "model.add(Dense(" + output_shape;
  if(input_shape == 0) code_dense += "))\n";
  else code_dense += ", input_dim=" + input_shape + "))\n";
  return code_dense
}

function add_cnn(input_shape, layer) {
  var code_cnn = "";
  code_cnn += "model.add(Conv2D(" + layer["out_channels"] + ", ";
  code_cnn += "(" + layer["kernel_size"][0] + ", " + layer["kernel_size"][1];
  code_cnn += "), activation='relu'"
  if(input_shape == 0) code_cnn += "))\n";
  // else code_cnn += ", input_shape=(" + input_shape[0] + "," + input_shape[1] + ")))\n";
  else code_cnn += ", input_shape=(" + input_shape + ")))\n";
  return code_cnn; 
}

function add_pooling(layer) {
  var code_pooling = "";
  code_pooling += "model.add(MaxPooling2D(pool_size=(" + layer["pool_size"][0];
  code_pooling += "," + layer["pool_size"][1] + ")))\n";
  return code_pooling;
}

function add_batch_norm(layer) {
  return "model.add(BatchNormalization())\n";
}

function add_embedding(dataset) {
  var code_emb = "";
  if(dataset == "imdb") {
    code_emb += "model.add(Embedding(20000, 128))\n";
  }
  return code_emb;
}

function add_lstm(layer, last_lstm) {
  var code_lstm = "";

  code_lstm += "model.add(";
  if(layer["bi-directional"] == true){
    code_lstm += "Bidirectional(";
    code_lstm +="LSTM(" + layer["state_size"];
    code_lstm += ", dropout=0.2, recurrent_dropout=0.2"
    if(last_lstm == true) code_lstm += ")))\n";
    else code_lstm += ", return_sequences=True)))\n";
  }
  else {
    code_lstm +="LSTM(" + layer["state_size"];
    code_lstm += ", dropout=0.2, recurrent_dropout=0.2"
    if(last_lstm == true) code_lstm += "))\n";
    else code_lstm += ", return_sequences=True))\n";
  }
  return code_lstm
}

function add_flatten() { return "model.add(Flatten())\n" }

function add_activation(activation) {
  return "model.add(Activation(" + "'" + activation + "'" + "))\n";
}

function add_final_layer(dataset) {
  code_model = "";
  if(dataset == "mnist" || dataset == "cifar10") {
    code_model += "model.add(Activation('softmax'))\n";
    code_model += "model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])\n\n\n";
  }
  else if(dataset == "imdb"){
    code_model += "model.add(Activation('sigmoid'))\n";
    code_model += "model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])\n\n\n";
  }
  return code_model;
}

function add_train(){
  var code_train = "";
  code_train += "## Training and evaluation\n";
  code_train += "model.fit(X_train, Y_train, epochs=10, batch_size=32)\n";
  code_train += "score = model.evaluate(X_test, Y_test, batch_size=128)\n";
  return code_train;
}

// ---- Examples with the mnist dataset ----
// Example 1
// net_config = {"name": "my_first_network", "dataset": "mnist"};
// network = [
//   {"name": "CNN", "kernel_size": [3, 3], "out_channels": 32},
//   {"name": "MaxPooling2D", "pool_size": [2, 2]},
//   {"name": "FC", "output_shape": 128},
//   {"name": "activation", "type": "sigmoid"},
//   {"name": "FC", "output_shape": 10},
// ]

// Example 2
// net_config = {"name": "my_second_network", "dataset": "mnist"};
// network = []

// Example 3
// net_config = {"name": "my_third_network", "dataset": "mnist"};
// network = [
//   {"name": "FC", "output_shape": 128},
//   {"name": "activation", "type": "sigmoid"},
//   {"name": "FC", "output_shape": 128},
//   {"name": "activation", "type": "sigmoid"},
//   {"name": "batch_norm"},
//   {"name": "FC", "output_shape": 10},
// ]

// ---- Examples with the cifar10 dataset ----
// Example 4
// net_config = {"name": "my_forth_network", "dataset": "cifar10"};
// network = [
//   {"name": "CNN", "kernel_size": [3, 3], "out_channels": 32},
//   {"name": "MaxPooling2D", "pool_size": [2, 2]},
//   {"name": "FC", "output_shape": 128},
//   {"name": "activation", "type": "sigmoid"},
//   {"name": "FC", "output_shape": 10},
// ]

// Example 5
// net_config = {"name": "my_fifth_network", "dataset": "cifar10"};
// network = [
//   {"name": "FC", "output_shape": 128},
//   {"name": "activation", "type": "sigmoid"},
//   {"name": "FC", "output_shape": 128},
//   {"name": "activation", "type": "tanh"},
//   {"name": "FC", "output_shape": 10},
// ]

// ---- Examples with the imdb dataset ----
// Example 6
// net_config = {"name": "my_sixth_network", "dataset": "imdb"};
// network = [
//   {"name": "LSTM", "state_size": 100, "bi-directional": true},
//   {"name": "FC", "output_shape": 1},
// ]

codes = compile(network, net_config)

console.log(codes)