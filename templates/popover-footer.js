(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['popover-footer'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "			<li><a>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</a></li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "				<li><a>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</a></li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "					<th>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</th>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "				<tr>\n"
    + ((stack1 = helpers.blockHelperMissing.call(depth0,container.lambda(depth0, depth0),{"name":".","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</tr>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "					<td>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</td>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=helpers.blockHelperMissing, buffer =
  "<div tabindex='0' class='popover' style='display: block; outline: none'>\n	<h3 class='popover-title maroonTitle'>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n	<div class='dropdown month-dropdown pull-left'>\n		<button class='btn btn-default btn-maroon dropdown-toggle' type='button' data-toggle='dropdown' aria-expanded='true'>\n			<span class='fa-chevron-circle-down'></span>\n			<span class='maroonMonth'>"
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + "</span>\n		</button>\n		<ul class='dropdown-menu maroonMonths' role='menu'>\n";
  stack1 = ((helper = (helper = helpers.months || (depth0 != null ? depth0.months : depth0)) != null ? helper : alias2),(options={"name":"months","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.months) { stack1 = alias5.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</ul>\n	</div>\n	<div class='dropdown pull-right'>\n		<button class='btn btn-default btn-maroon dropdown-toggle' type='button' data-toggle='dropdown' aria-expanded='true'>\n			<span class='maroonYear'>"
    + alias4(((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"year","hash":{},"data":data}) : helper)))
    + "</span>\n			<span class='fa-chevron-circle-down'></span>\n		</button>\n		<ul class='dropdown-menu maroonYears' role='menu'>\n";
  stack1 = ((helper = (helper = helpers.years || (depth0 != null ? depth0.years : depth0)) != null ? helper : alias2),(options={"name":"years","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.years) { stack1 = alias5.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</ul>\n	</div>\n	<div class='popover-content'>\n		<table class='table'>\n			<thead>\n				<tr class=\"maroonWeekdays\">\n";
  stack1 = ((helper = (helper = helpers.weekdaysMin || (depth0 != null ? depth0.weekdaysMin : depth0)) != null ? helper : alias2),(options={"name":"weekdaysMin","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.weekdaysMin) { stack1 = alias5.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "				</tr>\n			</thead>\n\n			<tbody class=\"maroonContent\">\n";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(options={"name":"content","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.content) { stack1 = alias5.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</tbody>\n		</table>\n	</div>\n	<div class='popover-footer col-xs-12'>\n		<div class=\" col-xs-6\">\n			<input class='form-control input-sm' type=\"text\" placeholder='Anreise' value="
    + alias4(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"startDate","hash":{},"data":data}) : helper)))
    + ">\n		</div>\n		<div class=\"col-xs-6\">\n			<input class='form-control input-sm' type=\"text\" placeholder='Abreise' value="
    + alias4(((helper = (helper = helpers.endDate || (depth0 != null ? depth0.endDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"endDate","hash":{},"data":data}) : helper)))
    + ">\n		</div>\n	</div>\n</div>\n";
},"useData":true});
})();
