import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import addSpaceBetweenDigits from "../../helpers/addSpaceBetweenDigits";

// How many items are shown in a table
const limitOptions = [10, 25, 50, 75, 100];

const months = [
	{ name : "All", value : 0 },
	{ name : "Apr", value : 4 },
	{ name : "May", value : 5 },
	{ name : "Jun", value : 6 },
	{ name : "Jul", value : 7 },
	{ name : "Aug", value : 8 },
	{ name : "Sep", value : 9 }
];

function TableHeadRow (props) {
	console.log( getSortObjFromString( "duration desc" ) )
	
	const { pagination, setLimit, currentLimit, query, setQuery, sort, setSort } = props;
	return (
		<Row className="mb-2">
			<Col sm="12" lg className="align-self-center">
				<p className="mb-0">Total { addSpaceBetweenDigits( pagination.totalDocs ) }</p>
			</Col>
			<Col xs="6" lg="2" className="align-self-center">
				<DropdownDistanceAndDuration sort={ sort } setSort={ setSort }/>
			</Col>
			<Col xs="6" lg="2" className="align-self-center">
				<DropdownMonth setQuery={ setQuery } query={ query }/>
			</Col>
			<Col xs="6" lg="2">
				<DropdownLimit setLimit={ setLimit } currentLimit={ currentLimit }/>
			</Col>
		</Row>
	);
}

function getSortObjFromString (string) {
	
	const key = string.split( " " )[0];
	const value = string.split( " " )[1];
	return { field : key, value }
}

function DropdownDistanceAndDuration ({ sort, setSort }) {
	return (
		<form>
			<select className="form-select" value="sort"
					onChange={ (e) => setSort( getSortObjFromString( e.target.value ) ) }
					aria-label="Sort journeys by duration or distance">
				<option value="duration asc"> Duration ascending</option>
				<option value="duration desc"> Duration descending</option>
				<option value="distance asc"> Distance ascending</option>
				<option value="distance desc"> Distance descending</option>
			</select>
		</form>
	)
}

function DropdownLimit ({ currentLimit, setLimit }) {
	return (
		<form>
			<select className="form-select" value={ currentLimit }
					onChange={ (e) => setLimit( parseInt( e.target.value ) ) }
					aria-label="Select how many items are shown in a table">
				{ limitOptions.map( limit => <option key={ limit }
													 value={ limit }>{ limit }</option> ) }
			</select>
		</form>
	)
}

function DropdownMonth ({ query, setQuery }) {
	return (
		<form>
			<select className="form-select" value={ query ? query.month : months[0].name }
					onChange={ (e) => setQuery( { month : parseInt( e.target.value ) } ) }
					aria-label="Select in which months journeys are shown in a table">
				{ months.map( month => <option key={ month.value }
											   value={ month.value }>{ month.name }</option> ) }
			</select>
		</form>
	)
}

export default TableHeadRow;
