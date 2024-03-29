import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import LoadingSpinner from "./components/LoadingSpinner";
import Error from "./components/Error";
import StationBasicInfo from "./components/StationBasicInfo";
import MostPopularStationTable from "./components/MostPopularStationTable";

import mapMarker from "../assets/map-marker.png";

const GET_STATION = gql`
  query Query($getStationId: Int!) {
    getStation(id: $getStationId) {
      stationId
      name
      address
      city
      capacity
      longitude
      latitude
      numOfJourneysStartingFrom
      numOfJourneysReturningTo
      averageDistanceStartingFrom
      averageDistanceReturnedTo
      mostPopularReturnStationsForJourneysStartingFrom {
        stationId
        name
      }
      mostPopularDepartureStationsForJourneysReturnedTo {
        stationId
        name
      }
    }
  }
`;

const customIcon = new L.Icon({
  iconUrl: mapMarker,
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [33, 36],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [40, 30],
});

function Station() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_STATION, {
    variables: { getStationId: Number(id) }, // From params it is String, but we need Number
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <Error error={error} />;

  const station = data.getStation;
  const position = [station.latitude, station.longitude];

  return (
    <Container className="station-container">
      <h1 className="text-center">
        {station.stationId}, {station.name}
      </h1>
      <Row className="station-info">
        <Col
          className="px-0"
          xs={{ span: 12, order: 2 }}
          md={{ span: 6, order: 1 }}
        >
          <StationBasicInfo station={station} />
        </Col>
        <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 2 }}>
          <MapContainer center={position} zoom={14} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={customIcon} position={position}>
              <Popup>
                <span>
                  {station.stationId}, {station.name}
                  <br />
                  {station.address}
                </span>
              </Popup>
            </Marker>
          </MapContainer>
        </Col>
      </Row>

      <Row className="mb-5 text-center">
        <h4 className="mb-3">Top 5 most popular...</h4>
        <Col md className="mt-3">
          <p>
            <strong>Departure stations </strong>for journeys
            <strong> ending </strong>at {station.name}
          </p>
          <MostPopularStationTable
            stations={station.mostPopularDepartureStationsForJourneysReturnedTo}
          />
        </Col>
        <Col className="mt-3">
          <p>
            <strong>Return stations</strong> for journeys{" "}
            <strong>starting</strong> from {station.name}:
          </p>
          <MostPopularStationTable
            stations={station.mostPopularReturnStationsForJourneysStartingFrom}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Station;
