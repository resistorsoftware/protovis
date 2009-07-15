/**
 * Represents a wedge, or pie slice. Specified in terms of start and end angle,
 * inner and outer radius, wedges can be used to construct donut charts and
 * polar bar charts as well. If the {@link #angle} property is used, the end
 * angle is implied by adding this value to start angle. By default, the start
 * angle is the previously-generated wedge's end angle. This design allows
 * explicit control over the wedge placement if desired, while offering
 * convenient defaults for the construction of radial graphs.
 *
 * <p>The center point of the circle is positioned using the standard box model.
 * The wedge can be stroked and filled, similar to {link Bar}.
 */
pv.Wedge = function() {
  pv.Mark.call(this);
};
pv.Wedge.prototype = pv.extend(pv.Mark);
pv.Wedge.prototype.type = pv.Wedge;
pv.Wedge.toString = function() { return "wedge"; };

/**
 * The start angle of the wedge, in radians. The start angle is measured
 * clockwise from the 3 o'clock position. The default value of this property is
 * the end angle of the previous instance (the {@link Mark#sibling}), or -PI / 2
 * for the first wedge; for pie and donut charts, typically only the {@link
 * #angle} property needs to be specified.
 */
pv.Wedge.prototype.defineProperty("startAngle");

/**
 * The end angle of the wedge, in radians. If not specified, the end angle is
 * implied as the start angle plus the {@link #angle}.
 */
pv.Wedge.prototype.defineProperty("endAngle");

/**
 * The angular span of the wedge, in radians. This property is used if end angle
 * is not specified.
 */
pv.Wedge.prototype.defineProperty("angle");

/**
 * The inner radius of the wedge, in pixels. The default value of this property
 * is zero; a positive value will produce a donut slice rather than a pie slice.
 * The inner radius can vary per-wedge.
 */
pv.Wedge.prototype.defineProperty("innerRadius");

/**
 * The outer radius of the wedge, in pixels. This property is required. For
 * pies, only this radius is required; for donuts, the inner radius must be
 * specified as well. The outer radius can vary per-wedge.
 */
pv.Wedge.prototype.defineProperty("outerRadius");

/**
 * The width of stroked lines, in pixels; used in conjunction with {@code
 * strokeStyle} to stroke the wedge's border.
 */
pv.Wedge.prototype.defineProperty("lineWidth");

/**
 * The style of stroked lines; used in conjunction with {@code lineWidth} to
 * stroke the wedge's border. The default value of this property is null,
 * meaning wedges are not stroked by default.
 */
pv.Wedge.prototype.defineProperty("strokeStyle");

/**
 * The wedge fill style; if non-null, the interior of the wedge is filled with
 * the specified color. The default value of this property is a categorical
 * color.
 */
pv.Wedge.prototype.defineProperty("fillStyle");

/**
 * Default properties for wedges. By default, there is no stroke and the fill
 * style is a categorical color.
 */
pv.Wedge.defaults = new pv.Wedge().extend(pv.Mark.defaults)
    .startAngle(function() {
        var s = this.sibling();
        return s ? s.endAngle : -Math.PI / 2;
      })
    .innerRadius(0)
    .lineWidth(1.5)
    .strokeStyle(null)
    .fillStyle(pv.Colors.category20.unique);

/**
 * Returns the mid-radius of the wedge, which is defined as half-way between the
 * inner and outer radii.
 *
 * @see #innerRadius
 * @see #outerRadius
 */
pv.Wedge.prototype.midRadius = function() {
  return (this.innerRadius() + this.outerRadius()) / 2;
};

/**
 * Returns the mid-angle of the wedge, which is defined as half-way between the
 * start and end angles.
 *
 * @see #startAngle
 * @see #endAngle
 */
pv.Wedge.prototype.midAngle = function() {
  return (this.startAngle() + this.endAngle()) / 2;
};

/**
 * Represents an anchor for a wedge mark. Wedges support five different anchors:<ul>
 *
 * <li>outer
 * <li>inner
 * <li>center
 * <li>start
 * <li>end
 *
 * </ul>In addition to positioning properties (left, right, top bottom), the
 * anchors support text rendering properties (textAlign, textBaseline,
 * textAngle). Text is rendered to appear inside the wedge.
 */
pv.Wedge.Anchor = function() {
  pv.Mark.Anchor.call(this);
};
pv.Wedge.Anchor.prototype = pv.extend(pv.Mark.Anchor);
pv.Wedge.Anchor.prototype.type = pv.Wedge;

/** The left property; non-null. */
pv.Wedge.Anchor.prototype.$left = function() {
  var w = this.anchorTarget();
  switch (this.get("name")) {
    case "outer": return w.left() + w.outerRadius() * Math.cos(w.midAngle());
    case "inner": return w.left() + w.innerRadius() * Math.cos(w.midAngle());
    case "start": return w.left() + w.midRadius() * Math.cos(w.startAngle());
    case "center": return w.left() + w.midRadius() * Math.cos(w.midAngle());
    case "end": return w.left() + w.midRadius() * Math.cos(w.endAngle());
  }
  return null;
};

/** The right property; non-null. */
pv.Wedge.Anchor.prototype.$right = function() {
  var w = this.anchorTarget();
  switch (this.get("name")) {
    case "outer": return w.right() + w.outerRadius() * Math.cos(w.midAngle());
    case "inner": return w.right() + w.innerRadius() * Math.cos(w.midAngle());
    case "start": return w.right() + w.midRadius() * Math.cos(w.startAngle());
    case "center": return w.right() + w.midRadius() * Math.cos(w.midAngle());
    case "end": return w.right() + w.midRadius() * Math.cos(w.endAngle());
  }
  return null;
};

/** The top property; non-null. */
pv.Wedge.Anchor.prototype.$top = function() {
  var w = this.anchorTarget();
  switch (this.get("name")) {
    case "outer": return w.top() + w.outerRadius() * Math.sin(w.midAngle());
    case "inner": return w.top() + w.innerRadius() * Math.sin(w.midAngle());
    case "start": return w.top() + w.midRadius() * Math.sin(w.startAngle());
    case "center": return w.top() + w.midRadius() * Math.sin(w.midAngle());
    case "end": return w.top() + w.midRadius() * Math.sin(w.endAngle());
  }
  return null;
};

/** The bottom property; non-null. */
pv.Wedge.Anchor.prototype.$bottom = function() {
  var w = this.anchorTarget();
  switch (this.get("name")) {
    case "outer": return w.bottom() + w.outerRadius() * Math.sin(w.midAngle());
    case "inner": return w.bottom() + w.innerRadius() * Math.sin(w.midAngle());
    case "start": return w.bottom() + w.midRadius() * Math.sin(w.startAngle());
    case "center": return w.bottom() + w.midRadius() * Math.sin(w.midAngle());
    case "end": return w.bottom() + w.midRadius() * Math.sin(w.endAngle());
  }
  return null;
};

/** The text-align property, for horizontal alignment inside the wedge. */
pv.Wedge.Anchor.prototype.$textAlign = function() {
  var w = this.anchorTarget();
  switch (this.get("name")) {
    case "outer": return pv.Wedge.upright(w.midAngle()) ? "right" : "left";
    case "inner": return pv.Wedge.upright(w.midAngle()) ? "left" : "right";
    default: return "center";
  }
};

/** The text-baseline property, for vertical alignment inside the wedge. */
pv.Wedge.Anchor.prototype.$textBaseline = function() {
  var w = this.anchorTarget();
  switch (this.get("name")) {
    case "start": return pv.Wedge.upright(w.startAngle()) ? "top" : "bottom";
    case "end": return pv.Wedge.upright(w.endAngle()) ? "bottom" : "top";
    default: return "middle";
  }
};

/** The text-angle property, for text rotation inside the wedge. */
pv.Wedge.Anchor.prototype.$textAngle = function() {
  var w = this.anchorTarget();
  var a = 0;
  switch (this.get("name")) {
    case "center":
    case "inner":
    case "outer": a = w.midAngle(); break;
    case "start": a = w.startAngle(); break;
    case "end": a = w.endAngle(); break;
  }
  return pv.Wedge.upright(a) ? a : (a + Math.PI);
};

/**
 * Returns true if the specified angle is consider "upright", as in, text
 * rendered at that angle would appear upright. If the angle is not upright,
 * text is rotated 180 degrees to be upright, and the text alignment properties
 * are correspondingly changed.
 *
 * @angle an angle, in radius.
 */
pv.Wedge.upright = function(angle) {
  angle = angle % (2 * Math.PI);
  angle = (angle < 0) ? (2 * Math.PI + angle) : angle;
  return (angle < Math.PI / 2) || (angle > 3 * Math.PI / 2);
};

/**
 * Overrides the default behavior of {@link Mark#buildImplied} such that the end
 * angle is computed from the start angle and angle (angular span) if not
 * specified.
 *
 * @param s a node in the scene graph; the instance of the wedge to build.
 */
pv.Wedge.prototype.buildImplied = function(s) {
  pv.Mark.prototype.buildImplied.call(this, s);
  if (s.endAngle == null) {
    s.endAngle = s.startAngle + s.angle;
  }
};

/**
 * Updates the display for the specified wedge instance {@code s} in the scene
 * graph. This implementation handles the fill and stroke style for the wedge,
 * as well as positional properties.
 *
 * @param s a node in the scene graph; the instance of the bar to update.
 */
pv.Wedge.prototype.updateInstance = function(s) {
  var v = s.svg;

  /* Create the <svg:path> element, if necessary. */
  if (s.visible && !v) {
    v = s.svg = document.createElementNS(pv.ns.svg, "path");
    v.setAttribute("fill-rule", "evenodd");
    s.parent.svg.appendChild(v);
  }

  /* visible, cursor, title, events, etc. */
  pv.Mark.prototype.updateInstance.call(this, s);
  if (!s.visible) return;

  /* left, top */
  v.setAttribute("transform", "translate(" + s.left + "," + s.top +")");

  /* innerRadius, outerRadius, startAngle, endAngle */
  var r1 = s.innerRadius, r2 = s.outerRadius;
  if (s.angle >= 2 * Math.PI) {
    if (r1) {
      v.setAttribute("d", "M0," + r2
          + "A" + r2 + "," + r2 + " 0 1,1 0," + (-r2)
          + "A" + r2 + "," + r2 + " 0 1,1 0," + r2
          + "M0," + r1
          + "A" + r1 + "," + r1 + " 0 1,1 0," + (-r1)
          + "A" + r1 + "," + r1 + " 0 1,1 0," + r1
          + "Z");
    } else {
      v.setAttribute("d", "M0," + r2
          + "A" + r2 + "," + r2 + " 0 1,1 0," + (-r2)
          + "A" + r2 + "," + r2 + " 0 1,1 0," + r2
          + "Z");
    }
  } else {
    var c1 = Math.cos(s.startAngle), c2 = Math.cos(s.endAngle),
        s1 = Math.sin(s.startAngle), s2 = Math.sin(s.endAngle);
    if (r1) {
      v.setAttribute("d", "M" + r2 * c1 + "," + r2 * s1
          + "A" + r2 + "," + r2 + " 0 "
          + ((s.angle < Math.PI) ? "0" : "1") + ",1 "
          + r2 * c2 + "," + r2 * s2
          + "L" + r1 * c2 + "," + r1 * s2
          + "A" + r1 + "," + r1 + " 0 "
          + ((s.angle < Math.PI) ? "0" : "1") + ",0 "
          + r1 * c1 + "," + r1 * s1 + "Z");
    } else {
      v.setAttribute("d", "M" + r2 * c1 + "," + r2 * s1
          + "A" + r2 + "," + r2 + " 0 "
          + ((s.angle < Math.PI) ? "0" : "1") + ",1 "
          + r2 * c2 + "," + r2 * s2 + "L0,0Z");
    }
  }

  /* fill, stroke TODO gradient, patterns */
  var fill = pv.color(s.fillStyle);
  v.setAttribute("fill", fill.color);
  v.setAttribute("fill-opacity", fill.opacity);
  var stroke = pv.color(s.strokeStyle);
  v.setAttribute("stroke", stroke.color);
  v.setAttribute("stroke-opacity", stroke.opacity);
  v.setAttribute("stroke-width", s.lineWidth);
};
