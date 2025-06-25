var jsspline = jsspline || {};

(function(jss){
    var Vector = function(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    };

    Vector.prototype.add = function(that){
        return new Vector(
            this.x + that.x,
            this.y + that.y,
            this.z + that.z
        );
    };

    Vector.prototype.scale = function(val) {
        return new Vector(
            this.x * val,
            this.y * val,
            this.z * val
        );
    };

    Vector.prototype.minus = function(that) {
        return new Vector(
            this.x - that.x,
            this.y - that.y,
            this.z - that.z
        );
    };

    Vector.prototype.distance = function(that){
        return Math.sqrt(
            Math.pow(this.x - that.x, 2.0) +
            Math.pow(this.y - that.y, 2.0) +
            Math.pow(this.z - that.z, 2.0)
        );
    };

    // Make jss globally available or adjust as per your actual environment
    var jss = jss || {};
    jss.Vector = Vector;

    var BSpline = function(config){
        var config = config || {};
        if(!config.steps){
            config.steps = 100;
        }
        this.steps = config.steps;
        this.way_points = [];
        this.nodes = [];
        this.distances = [];
    };

    BSpline.prototype.addWayPoint = function(pt) {
        // Just add the waypoint to the list.
        // No spline generation happens here.
        this.way_points.push(new jss.Vector(pt.x, pt.y, pt.z));
    };

    BSpline.prototype.generate = function() {
        // Clear existing nodes and distances to recalculate the entire curve
        this.nodes = [];
        this.distances = [];

        // A B-spline of degree 3 (cubic) requires at least 4 control points
        // to draw the first segment.
        if (this.way_points.length >= 4) {
            // Iterate through the waypoints to generate all segments.
            // Each segment uses 4 control points.
            for (var i = 0; i <= this.way_points.length - 4; ++i) {
                var pt1 = this.way_points[i];
                var pt2 = this.way_points[i+1];
                var pt3 = this.way_points[i+2];
                var pt4 = this.way_points[i+3];

                for(var s = 0; s < this.steps; ++s){
                    var u = s * 1.0 / this.steps;
                    var node = this.interpolate(u, pt1, pt2, pt3, pt4);

                    var distance = 0;
                    if(this.nodes.length > 0){
                        distance = this.distances[this.distances.length-1] + node.distance(this.nodes[this.nodes.length-1]);
                    }
                    this.nodes.push(node);
                    this.distances.push(distance);
                }
            }
        } else {
            console.warn("Not enough waypoints to generate a cubic B-spline. Need at least 4.");
        }
    };

    // The interpolate function for a cubic B-spline (uniform basis)
    BSpline.prototype.interpolate = function(u, pt1, pt2, pt3, pt4) {
        // Coefficients for cubic B-spline basis functions
        var u2 = u * u;
        var u3 = u2 * u;

        var b1 = (-u3 + 3 * u2 - 3 * u + 1) / 6;
        var b2 = (3 * u3 - 6 * u2 + 4) / 6;
        var b3 = (-3 * u3 + 3 * u2 + 3 * u + 1) / 6;
        var b4 = u3 / 6;

        var x = pt1.x * b1 + pt2.x * b2 + pt3.x * b3 + pt4.x * b4;
        var y = pt1.y * b1 + pt2.y * b2 + pt3.y * b3 + pt4.y * b4;
        var z = pt1.z * b1 + pt2.z * b2 + pt3.z * b3 + pt4.z * b4;

        return new jss.Vector(x, y, z);
    };

    // The interpolate function for a cubic B-spline (uniform basis)
    BSpline.prototype.interpolate = function(u, pt1, pt2, pt3, pt4) {
        // Coefficients for cubic B-spline basis functions
        var u2 = u * u;
        var u3 = u2 * u;

        var b1 = (-u3 + 3 * u2 - 3 * u + 1) / 6;
        var b2 = (3 * u3 - 6 * u2 + 4) / 6;
        var b3 = (-3 * u3 + 3 * u2 + 3 * u + 1) / 6;
        var b4 = u3 / 6;

        var x = pt1.x * b1 + pt2.x * b2 + pt3.x * b3 + pt4.x * b4;
        var y = pt1.y * b1 + pt2.y * b2 + pt3.y * b3 + pt4.y * b4;
        var z = pt1.z * b1 + pt2.z * b2 + pt3.z * b3 + pt4.z * b4;

        return new jss.Vector(x, y, z);
    };

    jss.BSpline = BSpline;

})(jsspline);

// var module = module || {};
// if(module) {
// 	module.exports = jsspline;
// }

export default jsspline