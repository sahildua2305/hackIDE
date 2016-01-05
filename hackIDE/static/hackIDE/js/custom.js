/* 
* @Author: sahildua2305
* @Date:   2016-01-06 01:50:10
* @Last Modified by:   sahildua2305
* @Last Modified time: 2016-01-06 01:50:42
*/


$(document).ready(function(){

	// contents of the editor at any step
	var editorContent;
	// flag to keep track of whether settings-pane is open or not
	var settingsPaneVisible = false;
	// language selected
	var languageSelected = "CPP";
	// editor-theme
	var editorThemeSelected = "DARK";
	// indent-spaces
	var indentSpaces = 4;


	// trigger extension
	ace.require("ace/ext/language_tools");
	// init the editor
	var editor = ace.edit("editor");

	// initial configuration of the editor
	editor.setTheme("ace/theme/dawn");
	editor.session.setMode("ace/mode/c_cpp");
	editor.getSession().setTabSize(indentSpaces);
	editorContent = editor.getValue();
	editor.setFontSize(15);
	// enable autocompletion and snippets
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});

	// create a simple selection status indicator
	var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
	var statusBar = new StatusBar(editor, document.getElementById("editor-statusbar"));


	// function to update editorContent with current content of editor
	function updateContent(editor){
		editorContent = editor.getValue();
	}


	// assigning a new key binding for ctrl-enter for running the code
	editor.commands.addCommand({

		name: 'codeRunCommand',
		bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
		exec: function(editor) {

			// TODO: implement code run feature
			console.log("Run the code.");

		},
		readOnly: false // false if this command should not apply in readOnly mode

	});


	// assigning a new key binding for ctrl-S for saving the code
	editor.commands.addCommand({

		name: 'codeSaveCommand',
		bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
		exec: function(editor) {

			// TODO: implement code save feature
			console.log("Save the code.");

		},
		readOnly: false // false if this command should not apply in readOnly mode

	});

	
	// when show-settings is clicked
	$("#show-settings").click(function(){
		
		console.log("#show-settings clicked.");
		
		if(settingsPaneVisible){
			// hide settings-pane
			$("#settings-pane").hide();
			// update flag
			settingsPaneVisible = false;
		}
		else{
			// hide settings-pane
			$("#settings-pane").show();
			// update flag
			settingsPaneVisible = true;
		}

	});


	// when download-code is clicked
	$("#download-code").click(function(){

		// TODO: implement download code feature

		console.log("#download-code clicked.");

	});


	// when lang is changed
	$("#lang").change(function(){
		
		languageSelected = $("#lang").val();

		// update the language (mode) for the editor
		if(languageSelected == "C" || languageSelected == "CPP"){
			editor.getSession().setMode("ace/mode/c_cpp");
		}
		else{
			editor.getSession().setMode("ace/mode/" + languageSelected.toLowerCase());
		}

		console.log("Language changed to " + languageSelected + ".");

	});


	// when editor-theme is changed
	$("#editor-theme").change(function(){
		
		editorThemeSelected = $("#editor-theme").val();
		
		// update the theme for the editor
		if(editorThemeSelected == "DARK"){
			editor.setTheme("ace/theme/twilight");
		}
		else if(editorThemeSelected == "LIGHT"){
			editor.setTheme("ace/theme/dawn");
		}

		console.log("Editor-theme changed to " + editorThemeSelected + ".");

	});


	// when indent-spaces is changed
	$("#indent-spaces").change(function(){

		indentSpaces = $("#indent-spaces").val();

		// update the indent size for the editor
		if(indentSpaces != ""){
			editor.getSession().setTabSize(indentSpaces);
			console.log("Indent-Spaces value changed to " + indentSpaces + ".");
		}

	});


	// to listen for a change in contents of the editor
	editor.getSession().on('change', function(e) {

		console.log("Contents of editor changed.");

	});


	// toggle custom input textarea
	$('#custom-input-checkbox').click(function () {

		$(".custom-input-container").slideToggle();

		console.log("#custom-input-container toggled.");

	});


	// when save-code is clicked
	$("#save-code").click(function(){

		// TODO: implement save code feature

		console.log("#save-code clicked.");

	});


	// when run-code is clicked
	$("#run-code").click(function(){

		// TODO: implement run code feature

		console.log("#run-code clicked.");

	});

});
