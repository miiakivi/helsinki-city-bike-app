import { MongoDataSource } from "apollo-datasource-mongodb";

class Stations extends MongoDataSource {
	async getStations () {
		return this.model.find();
	}
	
	async getStation (stationId) {
		console.log('station id is:', stationId);
		return this.model.findOne( { stationId } );
	}
}

export default Stations;