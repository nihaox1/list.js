/*!
 *****************************
 args = {
	data : [],
	cell : {
		width : 100,
		height : 125
	},
	render : function( data , index ){
		return html;
	},
	modal : function( modal , data , index ){
	
	}
 }
 *****************************
 */
$.fn.list_icon = function( args ){
	var self = this,
		tool,
		manage,
		data,
		ui,
		html,
		cell,
		config;
	ui = {
		main : 0
	};
	
	data = {
		list : {
			length : 0
		},
		total : 0,
		row_length : 0,
		row_size : 0,
		pane_size : 0
	};
	
	config = {
		info : 0,
		pane : {
			w : 0,
			y : 0
		}
	};
	
	cell = function( init_args ){
		var _tool,
			_manage,
			_config = {
				__modal 	: 0,
				__data 		: 0,
				__index		: 0,
				__info		: 0,
				__is_show	: false,
				__parent	: 0,
				onclick		: 0,
				render		: 0
			};
		_tool = {
			data : {
				set_cell_parent : function(){
					var _i = Math.floor( _config.__index / data.row_size );
					_config.__parent = ui.main.find("li[_row='" + _i + "']");
				},
				check : function( init_args ){
					_config.onclick = args.onclick || function(){return false;};
					_config.render = args.render || function(){return "";};
					_config.__data = init_args.data;
					_config.__index = init_args.index;
					_config.__event = config.info.modal || false;
					_tool.data.set_cell_parent();
				}
			},
			fill_cell : function(){
				var _modal = $( "<div style='width:" + config.info.cell.width + "px; height:" + config.info.cell.height + "px'>" + _config.render( _config.__data , _config.__index ) + "</div>" );
				_config.__parent.append( _modal );
				_modal.unbind("click").click(function( e ){
					_config.onclick( _config.__data , _config.__index , e , _config.__modal );
				});
				_config.__modal = _modal;
				if( _config.__event ){
					_config.__event( _modal , _config.__data , _config.__index );
				};
			},
			init : function( args ){
				_tool.data.check( args );
			}
		};
		_manage = {
			info : function(){
				return _config;
			},
			show : function(){
				if( !_config.__is_show ){
					_tool.fill_cell();
					_config.__is_show = true;
				};
			}
		};
		_tool.init( init_args );
		return _manage;
	};
	
	tool = {
		data : {
			remove_by_indexs : function( indexs ){
				var _data = config.info.data;
				for(var i = 0 , len = indexs.length; i < len; i++){
					_data[ indexs[ i ] ] = 0;
				};
				config.info.data = [];
				for(var i = 0 , len = _data.length; i < len; i++){
					if( _data[ i ] ){
						config.info.data.push( _data[ i ] );
					};
				}
			},
			get_pane_start_row_index : function(){
				var _scroll_top = ui.main.scrollTop();
				return Math.floor( _scroll_top / config.info.cell.height );
			},
			/*!
			 *	设置包括总条目 每行大小 版面大小 总行数等信息
			 */
			init_params : function(){
				var _w = ui.main.width(),
					_h = ui.main.height();
				ui.main.addClass("c_list_icon_ui");
				data.row_size = Math.floor( _w / args.cell.width );
				data.pane_size = Math.ceil( _h / args.cell.height );
				data.row_size = ( !data.row_size ) ? 1 : data.row_size;
			},
			init_for_data : function( args ){
				var _opt = {};
				for(var i = 0 , len = args.data.length; i < len; i++){
					_opt = {
						index : i,
						data : args.data[i]
					};
					data.list[ i ] = new cell( _opt );
				};
			}
		},
		event : {
			set_pane_scroll : function(){
				var _t = new Date();
				ui.main.unbind("scroll").scroll(function(){
					var _new_t = new Date();
					if( _new_t - _t > 50 ){
						tool.ui.current_pane();
						_t = _new_t;
					};
				});
				window.setInterval( function(){
					tool.ui.current_pane();
				} , 100 );
			}
		},
		ui : {
			current_pane : function(){
				var _start_row_index = tool.data.get_pane_start_row_index() * data.row_size,
					_index;
				for(var i = 0 , len = data.row_size * data.pane_size; i < len; i++){
					_index = _start_row_index + i;
					if( data.list[ _index ] ){
						data.list[ _index ].show();
					};
				};
			},
			init_rows : function(){
				var _ul = ["<ul>"];
				data.row_length = Math.ceil( args.data.length / data.row_size );
				for(var i = 0 , len = data.row_length; i < len; i++){
					_ul.push("<li _row='" + i + "' style='height:" + args.cell.height + "px'></li>");
				};
				_ul.push("</ul>");
				ui.main.html( _ul.join("") );
			}
		},
		init : function( args ){
			ui.main = $( self );
			config.info = $c.tool.rtn( args );
			tool.data.init_params();
			tool.ui.init_rows();
			tool.data.init_for_data( args );
			tool.ui.current_pane();
			tool.event.set_pane_scroll();
		}
	};
	manage = {
		remove : function( index ){
			if( $.isNumeric( index ) ){
				config.info.data.splice( index , 1 );
			} else if( typeof( index ) === "object" ){
				tool.data.remove_by_indexs( index.indexs );
			};
			manage.refresh();
		},
		refresh : function(){
			tool.init( config.info );
		}
	};
	tool.init( args );
	return manage;
};