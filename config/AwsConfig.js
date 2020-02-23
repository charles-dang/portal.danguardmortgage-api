module.exports = {
  aws_table_name: 'fruitsTable',
  aws_local_config: {
    region: 'eu-west-2',
    endpoint: process.env.DYNAMODB_HOST,
	accessKeyId: 'accessKeyId',
	secretAccessKey: 'secretAccessKey',
  }
};


