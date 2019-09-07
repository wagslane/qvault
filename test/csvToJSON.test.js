import csvToJSON from '../src/lib/csvToJSON';
import { expect } from 'chai';

it('csvToJSON valid', () => {
  // chrome format
  const csv = `name,url,username,password
test.com,https://www.amazon.com,usernamne_test,dfsadfasdfsdfs
example.co,https://angel.co/login,,ghfghffdsfdsf
,https://angel.co/login,,`;

  const jsonData = csvToJSON(csv);
  expect(jsonData).to.eql([
    {
      name: 'test.com',
      url: 'https://www.amazon.com',
      username: 'usernamne_test',
      password: 'dfsadfasdfsdfs',
    },
    {
      name: 'example.co',
      url: 'https://angel.co/login',
      username: '',
      password: 'ghfghffdsfdsf',
    },
    {
      name: '',
      url: 'https://angel.co/login',
      username: '',
      password: '',
    }
  ]);
});

it('csvToJSON quoted commas', () => {
  // chrome format
  const csv = `name,url,username,password
test.com,https://www.amazon.com,"usernamne,test",dfsadfasdfsdfs
example.co,https://angel.co/login,mail@gmail.com,ghfghffdsfdsf`;

  const jsonData = csvToJSON(csv);
  expect(jsonData).to.eql([
    {
      name: 'test.com',
      url: 'https://www.amazon.com',
      username: '"usernamne,test"',
      password: 'dfsadfasdfsdfs',
    },
    {
      name: 'example.co',
      url: 'https://angel.co/login',
      username: 'mail@gmail.com',
      password: 'ghfghffdsfdsf',
    }
  ]);
});

it('csvToJSON blank', () => {
  const csv = '';
  expect(() => {
    csvToJSON(csv);
  }).to.throw('No csv data found');
});

it('csvToJSON duplicate', () => {
  // chrome format
  const csv = `name,url,url,password
  test.com,https://www.amazon.com,usernamne_test,dfsadfasdfsdfs`;
  
  expect(() => {
    csvToJSON(csv);
  }).to.throw('Duplicate CSV headers');
});

it('csvToJSON duplicate', () => {
  // chrome format
  const csv = `name,url,username,password
  test.com,https://www.amazon.com,fdf,usernamne_test,dfsadfasdfsdfs`;
  
  expect(() => {
    csvToJSON(csv);
  }).to.throw('Invalid CSV body');
});
