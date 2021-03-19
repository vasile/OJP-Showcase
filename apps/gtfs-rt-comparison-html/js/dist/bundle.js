(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Date_Helpers_1 = require("./../helpers/Date_Helpers");
class GTFS_DB_Controller {
    constructor() {
        this.progress_controller = null;
        this.gtfs_rt_reporter = null;
        this.request_datetime = new Date();
        this.api_endpoint = 'http://localhost/work/vasile/sbb/ojp-opendata/repos/openTdataCH--OJP-Showcase/apps/gtfs-rt-comparison-html/data/gtfs-static-snapshot';
        this.gtfs_query_btn = document.getElementById('gtfs_query_btn');
        this.gtfs_query_btn.addEventListener('click', () => {
            this.handle_gtfs_query_btn_click();
        });
        this.query_request_day_el = document.getElementById('request-day');
        this.query_request_time_el = document.getElementById('request-time');
        this.query_interval_from_time_el = document.getElementById('interval-from-time');
        this.query_interval_to_time_el = document.getElementById('interval-to-time');
        this.gtfs_query_btn.disabled = true;
        this.update_request_time();
    }
    update_query_inputs() {
        const now_date = this.request_datetime;
        const date_f = Date_Helpers_1.Date_Helpers.formatDateYMDHIS(now_date);
        // - 30min
        const from_date = new Date(now_date.getTime() + (-30) * 60 * 1000);
        const from_date_f = Date_Helpers_1.Date_Helpers.formatDateYMDHIS(from_date);
        // + 3hours
        const to_date = new Date(now_date.getTime() + (3 * 60) * 60 * 1000);
        const to_date_f = Date_Helpers_1.Date_Helpers.formatDateYMDHIS(to_date);
        this.query_request_day_el.value = date_f.substring(0, 10);
        this.query_request_time_el.value = date_f.substring(11, 16);
        this.query_interval_from_time_el.value = from_date_f.substring(11, 16);
        this.query_interval_to_time_el.value = to_date_f.substring(11, 16);
    }
    load_resources(completion) {
        var _a;
        (_a = this.progress_controller) === null || _a === void 0 ? void 0 : _a.setBusy('Loading Resources...');
        // TODO - compute me
        const gtfs_db_day_s = '2021-03-17';
        let gtfs_db_snapshot_base = 'http://localhost/work/vasile/sbb/ojp-opendata/repos/openTdataCH--OJP-Showcase/apps/gtfs-rt-comparison-html/data/gtfs-static-snapshot' + '/gtfs_' + gtfs_db_day_s;
        gtfs_db_snapshot_base = 'https://vasile.github.io/OJP-Showcase/hrdf-tools/data/gtfs-static-snapshot' + '/gtfs_' + gtfs_db_day_s;
        const gtfs_db_lookups_url = gtfs_db_snapshot_base + '/db_lookups.json';
        const request_day_s = this.query_request_day_el.value;
        let gtfs_db_trips_url = gtfs_db_snapshot_base + '/trips_' + request_day_s + '.json';
        // gtfs_db_trips_url = 'http://localhost/work/vasile/sbb/ojp-opendata/repos/openTdataCH--OJP-Showcase/apps/gtfs-rt-comparison-html/data/gtfs-static-snapshot/gtfs_2021-03-17/trips_2021-03-18-sample.json';
        const resource_files = [
            gtfs_db_lookups_url,
            gtfs_db_trips_url,
        ];
        Promise.all(resource_files.map(resource_file => fetch(resource_file))).then(responses => Promise.all(responses.map(response => response.json()))).then(data_responses => {
            var _a, _b, _c, _d, _e, _f;
            (_a = this.gtfs_rt_reporter) === null || _a === void 0 ? void 0 : _a.setRequestDatetime(this.request_datetime);
            const data_response_lookups = data_responses[0];
            (_b = this.gtfs_rt_reporter) === null || _b === void 0 ? void 0 : _b.loadAgency(data_response_lookups.agency);
            (_c = this.gtfs_rt_reporter) === null || _c === void 0 ? void 0 : _c.loadStops(data_response_lookups.stops);
            (_d = this.gtfs_rt_reporter) === null || _d === void 0 ? void 0 : _d.loadRoutes(data_response_lookups.routes);
            (_e = this.gtfs_rt_reporter) === null || _e === void 0 ? void 0 : _e.loadTrips(data_responses[1]);
            this.gtfs_query_btn.disabled = false;
            (_f = this.progress_controller) === null || _f === void 0 ? void 0 : _f.setIdle();
            completion();
        });
    }
    update_request_time() {
        this.request_datetime = new Date();
        // // Override - TEST
        // let m = "2021-03-19 09:37:03".split(/\D/);
        // this.request_datetime = new Date(+m[0], +m[1] - 1, +m[2], +m[3], +m[4], +m[5]);
        this.update_query_inputs();
    }
    handle_gtfs_query_btn_click() {
        var _a;
        (_a = this.progress_controller) === null || _a === void 0 ? void 0 : _a.setBusy('Fetching GTFS-RT ...');
        this.gtfs_query_btn.disabled = true;
        this.update_request_time();
        let gtfs_rt_url = 'http://localhost/work/vasile/sbb/ojp-opendata/repos/openTdataCH--OJP-Showcase/apps/proxy-gtfsrt2020/gtfsrt2020';
        gtfs_rt_url = 'https://www.webgis.ro/tmp/proxy-gtfsrt2020/gtfsrt2020';
        // gtfs_rt_url = 'http://localhost/work/vasile/sbb/ojp-opendata/repos/openTdataCH--OJP-Showcase/apps/gtfs-rt-comparison-html/data/GTFS_RT-2021-03-19-0937-1616143023.json';
        const gtfs_rt_promise = fetch(gtfs_rt_url);
        Promise.all([gtfs_rt_promise]).then(responses => Promise.all(responses.map(response => response.json()))).then(data_responses => {
            var _a, _b, _c;
            this.gtfs_query_btn.disabled = false;
            (_a = this.progress_controller) === null || _a === void 0 ? void 0 : _a.setIdle();
            const gtfs_rt_response = data_responses[0];
            (_b = this.gtfs_rt_reporter) === null || _b === void 0 ? void 0 : _b.setRequestDatetime(this.request_datetime);
            const request_interval_from_hhmm = this.query_interval_from_time_el.value;
            const request_interval_from_date = Date_Helpers_1.Date_Helpers.setHHMMToDate(this.request_datetime, request_interval_from_hhmm);
            const request_interval_to_hhmm = this.query_interval_to_time_el.value;
            const request_interval_to_date = Date_Helpers_1.Date_Helpers.setHHMMToDate(this.request_datetime, request_interval_to_hhmm);
            (_c = this.gtfs_rt_reporter) === null || _c === void 0 ? void 0 : _c.loadGTFS_RT(gtfs_rt_response, request_interval_from_date, request_interval_to_date);
        });
    }
}
exports.default = GTFS_DB_Controller;

},{"./../helpers/Date_Helpers":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Date_Helpers_1 = require("../helpers/Date_Helpers");
const response_gtfs_static_query_1 = require("./../models/response_gtfs_static_query");
class GTFS_RT_Reporter {
    constructor() {
        this.request_datetime = new Date();
        this.map_gtfs_rt_trips = {};
        this.map_gtfs_all_trips = {};
        this.active_trips = [];
        this.map_gtfs_agency = {};
        this.map_gtfs_routes = {};
        this.map_gtfs_stops = {};
    }
    loadAgency(response_json) {
        this.map_gtfs_agency = {};
        const response_rows = response_json.rows;
        response_rows.forEach(agency => {
            const agency_id = agency.agency_id;
            this.map_gtfs_agency[agency_id] = agency;
        });
    }
    loadRoutes(response_json) {
        this.map_gtfs_routes = {};
        const response_rows = response_json.rows;
        response_rows.forEach(route => {
            const route_id = route.route_id;
            this.map_gtfs_routes[route_id] = route;
        });
    }
    loadStops(response_json) {
        this.map_gtfs_stops = {};
        const response_rows = response_json.rows;
        response_rows.forEach(stop => {
            const stop_id = stop.stop_id;
            this.map_gtfs_stops[stop_id] = stop;
        });
    }
    setRequestDatetime(request_datetime) {
        this.request_datetime = request_datetime;
    }
    loadTrips(response_json) {
        this.map_gtfs_all_trips = {};
        response_json.forEach(trip_condensed => {
            const route_id = trip_condensed.route_id;
            this.map_gtfs_all_trips[trip_condensed.trip_id] = trip_condensed;
        });
    }
    loadGTFS_RT(response_gtfs_rt, request_interval_from_date, request_interval_to_date) {
        this.map_gtfs_rt_trips = {};
        response_gtfs_rt.Entity.forEach(gtfs_rt_row => {
            var _a, _b;
            // gtfs_rt_row.TripUpdate.T
            const trip_id = (_b = (_a = gtfs_rt_row.TripUpdate) === null || _a === void 0 ? void 0 : _a.Trip) === null || _b === void 0 ? void 0 : _b.TripId;
            if (trip_id) {
                this.map_gtfs_rt_trips[trip_id] = gtfs_rt_row;
            }
            else {
                console.log('ERROR - cant find trip_id');
                console.log(gtfs_rt_row);
            }
        });
        const trip_day = new Date(this.request_datetime);
        const trip_day_midnight = Date_Helpers_1.Date_Helpers.setHHMMToDate(trip_day, "00:00");
        let active_trips = [];
        for (const trip_id in this.map_gtfs_all_trips) {
            const condensed_trip = this.map_gtfs_all_trips[trip_id];
            const route = this.map_gtfs_routes[condensed_trip.route_id];
            const agency = this.map_gtfs_agency[route.agency_id];
            const trip = response_gtfs_static_query_1.GTFS_Static_Trip.initWithCondensedTrip(condensed_trip, agency, route, trip_day_midnight);
            const is_active = trip.isActive(request_interval_from_date, request_interval_to_date);
            if (!is_active) {
                continue;
            }
            const is_finished = trip.isFinished(this.request_datetime);
            if (is_finished) {
                continue;
            }
            if (trip_id in this.map_gtfs_rt_trips) {
                trip.gtfsRT = this.map_gtfs_rt_trips[trip_id];
            }
            else {
                trip.gtfsRT = null;
            }
            active_trips.push(trip);
        }
        this.active_trips = active_trips;
        this.renderContent();
    }
    renderContent() {
        const map_group_trips = this.groupStaticTrips();
        let html_rows = [];
        let html_template_agency = document.getElementById('template_agency').innerHTML;
        let html_template_route = document.getElementById('template_route_name').innerHTML;
        for (const agency_id in map_group_trips) {
            const map_routes = map_group_trips[agency_id];
            const agency = this.map_gtfs_agency[agency_id];
            const map_trips_cno = this.computeAgencyTripsNo(map_routes);
            let agency_rt_cno = 0;
            let agency_no_rt_cno = 0;
            for (const route_name in map_trips_cno) {
                agency_rt_cno += map_trips_cno[route_name].rt_cno;
                agency_no_rt_cno += map_trips_cno[route_name].no_rt_cno;
            }
            let agency_html = html_template_agency.slice();
            const agency_display_name = agency.agency_name + '(' + agency.agency_id + ')';
            agency_html = agency_html.replace('[AGENCY_NAME]', agency_display_name);
            agency_html = agency_html.replace('[RT_NO]', agency_rt_cno.toString());
            agency_html = agency_html.replace('[NO_RT_NO]', agency_no_rt_cno.toString());
            let routes_html_rows = [];
            for (const route_short_name in map_routes) {
                let trips = map_routes[route_short_name];
                // TODO - sort already in the backend?
                trips = trips.sort((a, b) => a.departureTime < b.departureTime ? -1 : 1);
                let trips_html_rows = [];
                trips.forEach((trip, trip_idx) => {
                    var _a, _b;
                    let table_row_tds = [];
                    table_row_tds.push('<th scope="row">' + (trip_idx + 1).toString() + '</th>');
                    table_row_tds.push('<td>' + trip.tripID + '<br/>' + trip.route.route_id + '</td>');
                    let gtfs_rt_parts = [];
                    if (trip.gtfsRT) {
                        gtfs_rt_parts.push('<span class="badge rounded-pill bg-success">' + ((_b = (_a = trip.gtfsRT.TripUpdate) === null || _a === void 0 ? void 0 : _a.Trip) === null || _b === void 0 ? void 0 : _b.ScheduleRelationship) + '</span>');
                    }
                    else {
                        gtfs_rt_parts.push('<span class="badge rounded-pill bg-secondary text-white">NO GTFS-RT</span>');
                    }
                    if (trip.isInTheFuture(this.request_datetime)) {
                        gtfs_rt_parts.push('<span class="badge rounded-pill bg-warning text-dark">Future</span>');
                    }
                    const gtfs_rt_s = gtfs_rt_parts.join("<br/>");
                    table_row_tds.push('<td>' + gtfs_rt_s + '</td>');
                    const trip_from_s = Date_Helpers_1.Date_Helpers.formatDateYMDHIS(trip.departureTime).substr(10, 6);
                    const trip_to_s = Date_Helpers_1.Date_Helpers.formatDateYMDHIS(trip.arrivalTime).substr(10, 6);
                    table_row_tds.push('<td>' + trip_from_s + ' - ' + trip_to_s + '</td>');
                    let stop_times_parts = [];
                    trip.stop_times.forEach((stop_time, stop_idx) => {
                        const stop_data = this.map_gtfs_stops[stop_time.stop_id];
                        const stop_display_time = stop_time.stop_departure ? stop_time.stop_departure : stop_time.stop_arrival;
                        const stop_display_time_s = Date_Helpers_1.Date_Helpers.formatDateYMDHIS(stop_display_time).substr(10, 6);
                        const stop_time_s = '<span>' + stop_data.stop_name + ' (' + stop_display_time_s + ')</span>';
                        stop_times_parts.push(stop_time_s);
                    });
                    const stop_times_s = stop_times_parts.join(' - ');
                    table_row_tds.push('<td class="stop_times">' + stop_times_s + '</td>');
                    // table_row_tds.push('<td> - </td>');
                    const trip_row = '<tr>' + table_row_tds.join('') + '</tr>';
                    trips_html_rows.push(trip_row);
                });
                const route_trips_stats = map_trips_cno[route_short_name];
                let route_html = html_template_route.slice();
                route_html = route_html.replace('[ROUTE_NAME]', route_short_name);
                route_html = route_html.replace('[RT_NO]', route_trips_stats.rt_cno.toString());
                route_html = route_html.replace('[NO_RT_NO]', route_trips_stats.no_rt_cno.toString());
                const trips_table_rows_s = trips_html_rows.join("\n");
                const table_html = '<table class="table table-sm gtfs-trips"><thead><tr><th scope="col">ID</th><th scope="col" style="width: 400px;">TripID / RouteID</th><th scope="col" style="width: 300px;">GTFS-RT</th><th scope="col" class="align-middle" style="width: 200px;">Departure - Arrival</th><th scope="col" class="align-middle">Stops</th></tr></thead><tbody>' + trips_table_rows_s + '</tbody></table>';
                route_html = route_html.replace('[TABLE_HTML]', table_html);
                routes_html_rows.push(route_html);
            }
            const routes_html_s = routes_html_rows.join("\n");
            agency_html = agency_html.replace('[AGENCY_ROUTE_ROWS]', routes_html_s);
            html_rows.push(agency_html);
        }
        const wrapper_div = document.getElementById('content_wrapper');
        wrapper_div.innerHTML = html_rows.join("\n");
    }
    groupStaticTrips() {
        // AGENCY_ID > ROUTE_SHORT_NAME > 
        let map_group_trips = {};
        this.active_trips.forEach(trip => {
            const agency_id = trip.agency.agency_id;
            if (!(agency_id in map_group_trips)) {
                map_group_trips[agency_id] = {};
            }
            const map_agency_trips = map_group_trips[agency_id];
            const route_short_name = trip.route.route_short_name;
            if (!(route_short_name in map_agency_trips)) {
                map_agency_trips[route_short_name] = [];
            }
            map_agency_trips[route_short_name].push(trip);
        });
        return map_group_trips;
    }
    computeAgencyTripsNo(map_routes) {
        let map_trips_cno = {};
        for (const route_short_name in map_routes) {
            const trips = map_routes[route_short_name];
            if (!(route_short_name in map_trips_cno)) {
                map_trips_cno[route_short_name] = {
                    rt_cno: 0,
                    no_rt_cno: 0,
                };
            }
            trips.forEach(trip => {
                if (trip.gtfsRT) {
                    map_trips_cno[route_short_name].rt_cno += 1;
                }
                else {
                    map_trips_cno[route_short_name].no_rt_cno += 1;
                }
            });
        }
        return map_trips_cno;
    }
}
exports.default = GTFS_RT_Reporter;

},{"../helpers/Date_Helpers":5,"./../models/response_gtfs_static_query":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOM_Helpers_1 = require("./../helpers/DOM_Helpers");
class Progress_Controller {
    constructor() {
        const el_id = 'app-progress';
        this.progress_status_el = document.getElementById(el_id);
    }
    setIdle() {
        DOM_Helpers_1.DOM_Helpers.removeClassName(this.progress_status_el, 'bg-primary progress-bar-striped progress-bar-animated');
        DOM_Helpers_1.DOM_Helpers.addClassName(this.progress_status_el, 'bg-success');
        this.progress_status_el.innerText = 'Idle';
    }
    setBusy(message) {
        DOM_Helpers_1.DOM_Helpers.removeClassName(this.progress_status_el, 'bg-success');
        DOM_Helpers_1.DOM_Helpers.addClassName(this.progress_status_el, 'bg-primary progress-bar-striped progress-bar-animated');
        this.progress_status_el.innerText = message;
    }
}
exports.default = Progress_Controller;

},{"./../helpers/DOM_Helpers":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOM_Helpers = void 0;
class DOM_Helpers {
    static addClassName(dom_node, input_class_name) {
        const input_class_names = input_class_name.split(' ');
        input_class_names.forEach(class_name => {
            const class_names = dom_node.className.split(' ');
            const class_name_idx = class_names.indexOf(class_name);
            const has_class_name = class_name_idx !== -1;
            if (has_class_name) {
                return;
            }
            class_names.push(class_name);
            dom_node.className = class_names.join(' ');
        });
    }
    static removeClassName(dom_node, input_class_name) {
        const input_class_names = input_class_name.split(' ');
        input_class_names.forEach(class_name => {
            const class_names = dom_node.className.split(' ');
            const class_name_idx = class_names.indexOf(class_name);
            const has_class_name = class_name_idx !== -1;
            if (!has_class_name) {
                return;
            }
            class_names.splice(class_name_idx, 1);
            dom_node.className = class_names.join(' ');
        });
    }
}
exports.DOM_Helpers = DOM_Helpers;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Date_Helpers = void 0;
class Date_Helpers {
    static formatDateYMDHIS(d) {
        const date_parts = [
            d.getFullYear(),
            '-',
            ('00' + (d.getMonth() + 1)).slice(-2),
            '-',
            ('00' + d.getDate()).slice(-2),
            ' ',
            ('00' + d.getHours()).slice(-2),
            ':',
            ('00' + d.getMinutes()).slice(-2),
            ':',
            ('00' + d.getSeconds()).slice(-2)
        ];
        return date_parts.join('');
    }
    static setHHMMToDate(d, hhmm) {
        const time_parts = hhmm.split(':');
        const time_hours = parseInt(time_parts[0]);
        const time_minutes = parseInt(time_parts[1]);
        const new_date = new Date(d.getTime());
        new_date.setHours(time_hours, time_minutes, 0, 0);
        return new_date;
    }
}
exports.Date_Helpers = Date_Helpers;

},{}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GTFS_DB_Controller_1 = __importDefault(require("./controllers/GTFS_DB_Controller"));
const GTFS_RT_Reporter_1 = __importDefault(require("./controllers/GTFS_RT_Reporter"));
const Progress_Controller_1 = __importDefault(require("./controllers/Progress_Controller"));
const progress_controller = new Progress_Controller_1.default();
progress_controller.setIdle();
const gtfs_rt_reporter = new GTFS_RT_Reporter_1.default();
const gtfs_db_controller = new GTFS_DB_Controller_1.default();
gtfs_db_controller.progress_controller = progress_controller;
gtfs_db_controller.gtfs_rt_reporter = gtfs_rt_reporter;
gtfs_db_controller.load_resources(() => {
    console.log('loaded');
});
// import MapController from './controllers/map_controller';
// const map_controller = new MapController('map_canvas');
// map_controller.init_map();
// console.log('fff');

},{"./controllers/GTFS_DB_Controller":1,"./controllers/GTFS_RT_Reporter":2,"./controllers/Progress_Controller":3}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTFS_Static_Trip = void 0;
const Date_Helpers_1 = require("./../helpers/Date_Helpers");
class GTFS_Static_Trip {
    constructor(trip_id, stop_times, agency, route) {
        this.tripID = trip_id;
        this.departureTime = stop_times[0].stop_departure;
        this.arrivalTime = stop_times[stop_times.length - 1].stop_arrival;
        this.route = route;
        this.agency = agency;
        this.stop_times = stop_times;
        this.gtfsRT = null;
    }
    static initWithCondensedTrip(condensed_trip, agency, route, trip_day_midnight) {
        let stop_times = [];
        const stops_data = condensed_trip.stop_times_s.split(' -- ');
        stops_data.forEach((stop_data_s, idx) => {
            const is_first_stop = idx === 0;
            const is_last_stop = idx === stops_data.length - 1;
            const stop_data_parts = stop_data_s.split('|');
            const stop_id = stop_data_parts[0];
            let stop_arrival = null;
            if (!is_first_stop) {
                const arrival_s = stop_data_parts[1];
                stop_arrival = Date_Helpers_1.Date_Helpers.setHHMMToDate(trip_day_midnight, arrival_s);
            }
            let stop_departure = null;
            if (!is_last_stop) {
                const departure_s = stop_data_parts[2];
                stop_departure = Date_Helpers_1.Date_Helpers.setHHMMToDate(trip_day_midnight, departure_s);
            }
            const stop_time = {
                stop_id: stop_id,
                stop_arrival: stop_arrival,
                stop_departure: stop_departure,
            };
            stop_times.push(stop_time);
        });
        const trip = new GTFS_Static_Trip(condensed_trip.trip_id, stop_times, agency, route);
        return trip;
    }
    isActive(interval_from, interval_to) {
        if (this.arrivalTime === null || this.departureTime === null) {
            return false;
        }
        if (this.arrivalTime < interval_from) {
            return false;
        }
        if (this.departureTime > interval_to) {
            return false;
        }
        return true;
    }
    isFinished(request_time) {
        if (this.arrivalTime === null || this.departureTime === null) {
            return true;
        }
        if (this.arrivalTime < request_time) {
            return true;
        }
        return false;
    }
    isInTheFuture(request_time) {
        if (this.arrivalTime === null || this.departureTime === null) {
            return true;
        }
        if (this.departureTime > request_time) {
            return true;
        }
        return false;
    }
}
exports.GTFS_Static_Trip = GTFS_Static_Trip;

},{"./../helpers/Date_Helpers":5}]},{},[6]);
