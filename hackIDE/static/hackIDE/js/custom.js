/* 
* @Author: sahildua2305
* @Date:   2016-01-06 01:50:10
* @Last Modified by:   sahildua2305
* @Last Modified time: 2016-01-07 02:16:57
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

	// HackerEarth API endpoints
	var COMPILE_URL = "compile/"
	var RUN_URL = "run/"


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


	// disable compile code button initially
	$('#compile-code').prop('disabled', true);
	$("#run-code").prop('disabled', true);


	// function to update editorContent with current content of editor
	function updateContent(){
		editorContent = editor.getValue();
		console.log("Updated Content:\n" + editorContent);
	}


	// function to send AJAX request to 'compile/' endpoint
	function compileCode(){
		
		// hide previous compile/output results
		$(".output-response-box").hide();

		// Change button text when this method is called
		$("#compile-code").html("Compiling..");

		// take recent content of the editor for compiling
		updateContent();

		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

		var compile_data = {
			source: editorContent,
			lang: languageSelected,
			csrfmiddlewaretoken: csrf_token
		};

		// AJAX request to Django for compiling code
		$.ajax({
			url: COMPILE_URL,
			type: "POST",
			data: compile_data,
			dataType: "json",
			success: function(response){
				console.log("compile-code AJAX request done.");
				console.log(response);

				// Change button text when this method is called
				$("#compile-code").html("Compile it!");

				$("html, body").delay(500).animate({
					scrollTop: $('#show-results').offset().top 
				}, 1000);

				$(".output-response-box").show();
				$(".run-status").hide();
				$(".time-sec").hide();
				$(".memory-kb").hide();

				if(response.compile_status == "OK"){
					$(".output-io").hide();
					$(".compile-status").children(".value").html("OK");
				}
				else{
					$(".output-io").show();
					$(".output-error-box").show();
					$(".output-io-info").hide();
					$(".compile-status").children(".value").html("--");
					$(".error-key").html("Compile error");
					$(".error-message").html(response.compile_status);
				}
			},
			error: function(error){
				console.log("compile-code AJAX request failed.");

				// Change button text when this method is called
				$("#compile-code").html("Compile it!");
			}
		});

	}


	// function to send AJAX request to 'compile/' endpoint
	function runCode(){
		
		// hide previous compile/output results
		$(".output-response-box").hide();

		// Change button text when this method is called
		$("#run-code").html("Running..");

		// take recent content of the editor for compiling
		updateContent();

		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

		var run_data = {
			source: editorContent,
			lang: languageSelected,
			csrfmiddlewaretoken: csrf_token
		};

		// AJAX request to Django for compiling code
		$.ajax({
			url: RUN_URL,
			type: "POST",
			data: run_data,
			dataType: "json",
			success: function(response){
				console.log("run-code AJAX request done.");
				console.log(response);

				// Change button text when this method is called
				$("#run-code").html("Hack(run) it!");

				$("html, body").delay(500).animate({
					scrollTop: $('#show-results').offset().top 
				}, 1000);

				$(".output-response-box").show();
				$(".run-status").show();
				$(".time-sec").show();
				$(".memory-kb").show();

				if(response.compile_status == "OK"){
					if(response.run_status.status == "AC"){
						$(".output-io").show();
						$(".output-error-box").hide();
						$(".output-io-info").show();
						$(".compile-status").children(".value").html(response.compile_status);
						$(".run-status").children(".value").html(response.run_status.status);
						$(".time-sec").children(".value").html(response.run_status.time_used);
						$(".memory-kb").children(".value").html(response.run_status.memory_used);
						$(".output-o").html(response.run_status.output_html);
					}
					else{
						$(".output-io").show();
						$(".output-error-box").show();
						$(".compile-status").children(".value").html(response.compile_status);
						$(".run-status").children(".value").html(response.run_status.status);
						$(".time-sec").children(".value").html(response.run_status.time_used);
						$(".memory-kb").children(".value").html(response.run_status.memory_used);
						$(".error-key").html("Run-time error (stderr)");
						$(".error-message").html(response.run_status.stderr);
					}
				}
				else{
					$(".output-io").show();
					$(".output-io-info").hide();
					$(".compile-status").children(".value").html("--");
					$(".run-status").children(".value").html("CE");
					$(".time-sec").children(".value").html("0.0");
					$(".memory-kb").children(".value").html("0");
					$(".error-key").html("Compile error");
					$(".error-message").html(response.compile_status);
				}
			},
			error: function(error){
				console.log("run-code AJAX request failed.");
				
				// Change button text when this method is called
				$("#run-code").html("Hack(run) it!");
			}
		});

	}


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

		updateContent();

		// disable compile & run buttons when editor is empty
		if(editorContent != ""){
			$("#compile-code").prop('disabled', false);
			$("#run-code").prop('disabled', false);
		}
		else{
			$("#compile-code").prop('disabled', true);
			$("#run-code").prop('disabled', true);
		}

	});


	// toggle custom input textarea
	$('#custom-input-checkbox').click(function () {

		$(".custom-input-container").slideToggle();

		console.log("#custom-input-container toggled.");

	});


	// assigning a new key binding for shift-enter for compiling the code
	editor.commands.addCommand({

		name: 'codeCompileCommand',
		bindKey: {win: 'Shift-Enter',  mac: 'Shift-Enter'},
		exec: function(editor) {

			updateContent();
			if(editorContent != ""){
				console.log("Compile the code.");
				compileCode();
			}

		},
		readOnly: false // false if this command should not apply in readOnly mode

	});


	// assigning a new key binding for ctrl-enter for running the code
	editor.commands.addCommand({

		name: 'codeRunCommand',
		bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
		exec: function(editor) {

			updateContent();
			if(editorContent != ""){
				runCode();
				console.log("Run the code.");
			}

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


	// when save-code is clicked
	$("#save-code").click(function(){

		// TODO: implement save code feature
		
		console.log("#save-code clicked.");

	});


	// when compile-code is clicked
	$("#compile-code").click(function(){

		console.log("#compile-code clicked.");

		compileCode();

	});


	// when run-code is clicked
	$("#run-code").click(function(){

		console.log("#run-code clicked.");

		runCode();

	});

});
