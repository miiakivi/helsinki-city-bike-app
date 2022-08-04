import fs from "fs";
import csv from "csv-parser";
import toCamelCase from "./helpers/toCamelCase";

import { Journey as JourneyModel } from "./models/journey";
import csvWriter from "csv-write-stream";

let writer = csvWriter();

import cvsToJson from "csvtojson";

import { streamToMongoDB } from "stream-to-mongo-db";

const validatedCsvFilePath = '/Users/miianyyssonen/Documents/Ohjelmointi/hsl-bicycle-stations/server/src/validatedJourneys.csv';

async function validateCSVFiles (filePath) {
	let headerRowIsWritten = false;
	fs.createReadStream( filePath )
	  .pipe( csv( {
		  mapHeaders : ({ header, index }) => {
			  header = header.trim(); // Remove whitespace
			  switch ( index ) {
				  case 6:
					  return toCamelCase( header.slice( 0, -3 ) );
				  case 7:
					  return toCamelCase( header.slice( 0, -6 ) );
				  default:
					  return toCamelCase( header );
			  }
		  },
		  mapValues : ({ header, index, value }) => {
			  switch ( header ) {
				  case "departureStationId":
					  return parseInt( value );
				  case "returnStationId":
					  return parseInt( value );
				  case "duration":
					  return parseInt( value );
				  case "coveredDistance":
					  return parseInt( value );
				  default:
					  return value;
			  }
		  },
		  strict : true,
	  } ) )
	
	  .on( 'data', (row) => {
		  validateData( row, () => {
			  if ( !headerRowIsWritten ) {
				  console.log( "Writing header row" );
				  headerRowIsWritten = true;
				  writer = csvWriter( { sendHeaders : true } );
			  } else {
				  writer = csvWriter( { sendHeaders : false } );
			  }
			  writer.pipe( fs.createWriteStream( validatedCsvFilePath, { flags : 'a' } ) );
			  writer.write( row );
			  writer.end();
			
		  } )
	  } )
	  .on( 'end', () => {
		  console.log( '🎉 CSV file validation complete' );
		  cvsToJson( {
			  headers : ["departure", "return", "departureStationId", "departureStationName", "returnStationId", "returnStationName", "coveredDistance", "duration"]
		  } )
			  .fromFile( validatedCsvFilePath )
			  .then( jsonObj => {
					  console.log( '🎉 CSV file converted to JSON' );
					  JourneyModel.insertMany( jsonObj, (err, docs) => {
						  if ( err ) throw err;
						  console.log( docs[0] );
						  console.log( `🎉 Inserted  journeys to database` );
						
					  } )
				  }
			  )
	  } );
}


export default validateCSVFiles;
