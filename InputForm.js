define(["qlik", "css!./style.css"], function(qlik) {
	return {
		initialProperties: {
			FormItems: [],
			selectItems: []
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				InputFormSettings: {
					label: "Input Form Settings",
					type: "items",
					items: {
						URL: {
							type: "string",
							ref: "URL",
							label: "URL",
							expression: "optional"
						},
						RequestType: {
							type: "string",
							component: "radiobuttons",
							label: "Request Type",
							ref: "RequestType",
							options: [{
								value: "get",
								label: "Get"
							}, {
								value: "post",
								label: "Post"
							}],
							defaultValue: "get"
						},
						ButtonLabel: {
							type: "string",
							ref: "ButtonLabel",
							label: "Button Label",
							expression: "optional"
						},
						/*ButtonValue: {
							type: "string",
							ref: "ButtonValue",
							label: "Button Value",
							expression: "optional"
						},*/
						ButtonId: {
							type: "string",
							ref: "ButtonId",
							label: "Button Id"
							//expression: "optional"
						},
						btnReload: {
							type: "boolean",
							label: "Reload Button",
							ref: "btnReload",
							defaultValue: true
						},
						ReloadOptions: {
							type: "string",
							component: "dropdown",
							label: "Reload Options",
							ref: "ReloadOptions",
							options: [{
								value: 0,
								label: "default mode"
							}, {
								value: 1,
								label: "attempt recovery on all errors"
							}, {
								value: 2,
								label: "fail on all errors"
							}],
							defaultValue: 0,
							show:function(d){
								return d.btnReload;
							}
						},
						btnReloadPartial: {
							type: "boolean",
							label: "Partial Reload",
							ref: "btnReloadPartial",
							defaultValue: false,
							show:function(d){
								return d.btnReload;
							}
						}
						
					}
				},
				FormList: {
					type: "array",
					ref: "FormItems",
					label: "Form Items",
					itemTitleRef: "label",
					allowAdd: true,
					allowRemove: true,
					addTranslation: "Add Item",
					items: {
						label: {
							type: "string",
							ref: "label",
							label: "Label",
							expression: "optional"
						},
						inputType: {
							type: "string",
							component: "dropdown",
							label: "Type",
							ref: "inputType",
							options: [{
								value: "date",
								label: "Date"
							}, {
								value: "number",
								label: "Number"
							}, {
								value: "text",
								label: "Text"
							}, {
								value: "password",
								label: "Password"
							}, {
								value: "radio",
								label: "Radio"
							}, {
								value: "checkbox",
								label: "Checkbox"
							}, {
								value:"select",
								label:"Dropdown"
							}],
							defaultValue: "text"
						},
						SelectValues:{
							show: function(d){
								return(d.inputType=='select');
							},
							type:"items",
							items:{
								SelectList: {
									type: "array",
									ref: "selectItems",
									label: "Select Options",
									itemTitleRef: "Value",
									allowAdd: true,
									allowRemove: true,
									addTranslation: "Add Options",
									items: {
										Value: {
											type: "string",
											ref: "Value",
											label: "Value",
											expression: "optional"
										}
									}
								}
							}
						},
						Value: {
							type: "string",
							ref: "Value",
							label: "Value",
							expression: "optional",
							show: function(d){
								return d.inputType!='select';
							}
						},
						Id: {
							type: "string",
							ref: "Id",
							label: "Id"
							//expression: "optional"
						},
						hide: {
							type: "boolean",
							label: "Show/Hide",
							ref: "hide",
							defaultValue: false
						},
						disable: {
							type: "boolean",
							label: "Enable/Disable",
							ref: "disable",
							defaultValue: false
						},
						Required: {
							type: "boolean",
							label: "Required",
							ref: "Required",
							defaultValue: false
						}
					}
				},
				settings: {
					uses: "settings",
					items: {
						customCss: {
							type: "string",
							ref: "customCss",
							label: "Custom CSS",
							expression: "optional"
						}
					}
				}
			}
		},
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
		paint: function($element, layout) {
			//add your rendering code here
			//console.log(layout);
			var app = qlik.currApp(this);
			var id = layout.qInfo.qId,
				contID = "cont_" + id,
				html = '<p id="error_'+id+'"></p><form id="Form_' + id + '" action="' + layout.URL + '" method="' + layout.RequestType + '">';
			$.each(layout.FormItems, function(k, v) {
				//console.log(k,v);
				var label = v.label,
					inputType = v.inputType,
					Value = v.Value,
					Id = v.Id,
					cId = v.cId,
					hide = (v.hide ? 'hide' : ''),
					disable = (v.disable ? 'disabled' : ''),
					Required = (v.Required ? 'required' : '');
				if (inputType == 'radio') {
					html += `						
						<label class="lui-radiobutton ` + hide + `">
							<input class="lui-radiobutton__input" type="radio" id="` + Id + `" name="` + Id + `" value="` + Value + `" inputID="` + cId + `" ` + disable + ` `+Required+`/>
							<div class="lui-radiobutton__radio-wrap">
								<span class="lui-radiobutton__radio"></span>
								<span class="lui-radiobutton__radio-text">` + label + `</span>
							</div>
						</label>`;
				} else if (inputType == 'checkbox') {
					html += `		
							<label class="lui-checkbox ` + hide + `">
								<input class="lui-checkbox__input" type="checkbox" id="` + Id + `" name="` + Id + `" value="` + Value + `" inputID="` + cId + `"  ` + disable + `  `+Required+`/>
								<div class="lui-checkbox__check-wrap">
									<span class="lui-checkbox__check"></span>
									<span class="lui-checkbox__check-text">` + label + `</span>
								</div>
							</label>`
				}else if(inputType == 'select'){
					var opt;
					$.each(v.selectItems, function(k, v) {
						opt+='<option value="'+v.Value+'">'+v.Value+'</option>';
					});
					html+='<div class="Form_List ' + hide + '"><label class="Form_Label" for="' + Id + '">' + label + '</label><select  '+Required+' inputID="' + cId + '" id="' + Id + '" name="' + Id + '" class="lui-select Form_input">'+opt+'</select></div>';
					//<option value="1">First</option>
				}else {
					html += '<div class="Form_List ' + hide + '"><label class="Form_Label" for="' + Id + '">' + label + '</label><input  '+Required+' class="lui-input Form_input" inputID="' + cId + '" id="' + Id + '" name="' + Id + '" type="' + inputType + '" placeholder="Enter ' + label + '" value="' + Value + '"  ' + disable + '></div>';
				}
			});
			html += '<button  id="' + layout.ButtonId + '" class="lui-button lui-button--success">' + layout.ButtonLabel + '</button>';
			html += '</form>';
			$element.html(html);
			var frm = $('#Form_' + id);
			frm.submit(function(e) {
				e.preventDefault();
				$.ajax({
					type: frm.attr('method'),
					url: frm.attr('action'),
					data: frm.serialize(),
					success: function(data) {
						console.log('Submission was successful.');
						console.log(data);
						$('#error_'+id).css({"background":"#d6d6d6","color":"#000"}).html(data);
						//setTimeout(function() {
						//	$('#error_'+id).hide('slow');
					  	//}, 50000)
						if(layout.btnReload){
							Reload(app,layout.btnReloadPartial,layout.ReloadOptions);
						}
					},
					error: function(data) {
						console.log('An error occurred.');
						console.log(data);
						$('#error_'+id).css({"background":"#d6d6d6","color":"#000"}).html(data);
						//setTimeout(function() {
						//	$('#error_'+id).hide('slow');
					  	//}, 50000)
						if(layout.btnReload){
							Reload(app,layout.btnReloadPartial,layout.ReloadOptions);
						}
					},
				});
			});
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};
});

function Reload(app,btnReloadPartial,ReloadOptions){
	console.log('Started',btnReloadPartial,ReloadOptions);
	app.doReload(ReloadOptions,btnReloadPartial,false).then(function(){
		console.log('End');
	   app.doSave().then(function(){
	   	console.log('Saved');
	   });
	});
}