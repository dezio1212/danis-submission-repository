const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('usage: node mongo.js <db-password');
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const name = process.argv[3];
const number = process.argv[4];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.eku7hsp.mongodb.net/phonebook` +
  `?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
  const person = new Person({ name, number });
  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.error('Error saving person:', err.message);
      mongoose.connection.close();
    });
} else {
  Person.find({})
    .then((result) => {
      console.log('phonebook:');
      result.forEach((p) => console.log(`${p.name} ${p.number}`));
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.error('Error fetching persons:', err.message);
      mongoose.connection.close();
    });
}
