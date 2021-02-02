import React, { Component } from 'react';
import { MapContainer, MapConsumer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import CbcConvert from './CbcConvert';
import { useState } from "react";
import { LatLng } from 'leaflet';
function ZoomLevelCheck(props) {
    const [zoomLevel, setZoomLevel] = useState(props.zoomLevel); // initial zoom level provided for MapContainer

    var [lineArr, setLineArr] = useState([]);
    const map = useMap();
    var state = true;

    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
            setLineArr(CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast));
        },
        moveend: () => {
            setLineArr(CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast));
        },
    });

    map.whenReady(function (e) {
        if (state) {
            lineArr = CbcConvert.lineArray(zoomLevel, map.getBounds()._southWest, map.getBounds()._northEast);
            state = false;
        }
    });

    if (lineArr.length != 0) {
        return (
            <div>
                {lineArr.map(({ id, latLongArr, cbcText }) => {
                    return <Polygon key={id} positions={latLongArr} color={'white'}
                        eventHandlers={{
                            click: (e) => {
                                console.log([e.latlng["lat"], e.latlng["lng"]]);
                                CbcConvert.converter([e.latlng["lng"], e.latlng["lat"]]);
                            },
                        }}>
                        <Tooltip direction='bottom' opacity={1} permanent>
                            <span>{cbcText}</span>
                        </Tooltip>
                    </Polygon>

                })}
            </div>
        )
    } else {
        return null;
    }

}
class Maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }
    // componentDidUpdate() {

    // }
    render() {
        //36.09698006901975,129.38089519358994
        //37.55122041521281, 126.98823732740473
        const position = [this.props.lat, this.props.lng];
        const cbc = CbcConvert.converter([this.props.lng, this.props.lat]);
        const cbcTxt = cbc[0] + " " + cbc[1] + " " + cbc[2];
        console.log(cbcTxt);
        return (
            <div>
                <MapContainer style={{ height: "100vh" }} center={position} zoom={this.props.zoomLevel}
                    scrollWheelZoom={true}>
                    <TileLayer maxZoom={22} maxNativeZoom={18} zoom={this.props.zoomLevel}
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://api.vworld.kr/req/wmts/1.0.0/5FE9AB0A-3B34-32F3-A646-1133D92EF014/midnight/{z}/{y}/{x}.png'

                    />
                    <ZoomLevelCheck zoomLevel={this.props.zoomLevel} />
                    <MapConsumer>
                        {(map) => {
                            // 헤더로부터 입력받은 값을 업데이트
                            map.setView(new LatLng(this.props.lat, this.props.lng), this.props.zoomLevel)
                            return null
                        }}
                    </MapConsumer>
                    <Marker position={position}>
                        <Popup>
                            <span className="popupSpan">
                                <b>{cbcTxt}</b>
                                <br />
                                {this.props.lat}, {this.props.lng}</span>
                        </Popup>
                    </Marker>
                </MapContainer >

            </div >

        )
    }
}

export default Maps;