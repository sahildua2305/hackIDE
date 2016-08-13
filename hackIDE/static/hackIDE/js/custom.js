/*
* @Author: sahildua2305
* @Date:   2016-01-06 01:50:10
* @Last Modified by:   Sahil Dua
* @Last Modified time: 2016-08-13 13:13:25
*/


$(document).ready(function(){

	// contents of the editor at any step
	var editorContent;
	// language selected
	var languageSelected = "CPP";
	// editor-theme
	var editorThemeSelected = "DARK";
	// indent-spaces
	var indentSpaces = 4;

	// HackerEarth API endpoints
	var COMPILE_URL = "compile/"
	var RUN_URL = "run/"

	//Language Boilerplate Codes
	var langBoilerplate = {}
	langBoilerplate['C'] = "#include <stdio.h>\nint main(void) {\n	// your code goes here\n	return 0;\n}\n";
	langBoilerplate['CPP'] = "#include <iostream>\nusing namespace std;\n\nint main() {\n	// your code goes here\n	return 0;\n}\n";
	langBoilerplate['CSHARP'] = "using System;\n\npublic class Test\n{\n	public static void Main()\n	{\n		// your code goes here\n	}\n}\n";
	langBoilerplate['CSS'] = "/* begin writing below */";
	langBoilerplate['CLOJURE'] = "; your code goes here";
	langBoilerplate['HASKELL'] = "main = -- your code goes here";
	langBoilerplate['JAVA'] = "public class TestDriver {\n    public static void main(String[] args) {\n        // Your code goes here\n    }\n}";
	langBoilerplate['JAVASCRIPT'] = "importPackage(java.io);\nimportPackage(java.lang);\n\n// your code goes here\n";
	langBoilerplate['OBJECTIVEC'] = "#import <objc/objc.h>\n#import <objc/Object.h>\n#import <Foundation/Foundation.h>\n\n@implementation TestObj\nint main()\n{\n	// your code goes here\n	return 0;\n}\n@end";
	langBoilerplate['PERL'] = "#!/usr/bin/perl\n# your code goes here\n";
	langBoilerplate['PHP'] = "<?php\n\n// your code goes here\n";
	langBoilerplate['PYTHON'] = "def main():\n    # Your code goes here\n\nif __name__ == \"__main__\":\n    main()";
	langBoilerplate['R'] = "# your code goes here";
	langBoilerplate['RUBY'] = "# your code goes here";
	langBoilerplate['RUST'] = "fn main() {\n    // The statements here will be executed when the compiled binary is called\n\n    // Print text to the console\n    println!(\"Hello World!\");\n}\n";
	langBoilerplate['SCALA'] = "object Main extends App {\n	// your code goes here\n}\n";

	// flag to block requests when a request is running
	var request_ongoing = false;

	// set base path of ace editor. Required by WhiteNoise
	ace.config.set("basePath", "/static/hackIDE/ace-builds/src/");
	// trigger extension
	ace.require("ace/ext/language_tools");
	// init the editor
	var editor = ace.edit("editor");

	// initial configuration of the editor
	editor.setTheme("ace/theme/twilight");
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
	// include boilerplate code for selected default language
	editor.setValue(langBoilerplate[languageSelected]);

	// create a simple selection status indicator
	var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
	var statusBar = new StatusBar(editor, document.getElementById("editor-statusbar"));


	checkForInitialData();

	function showResultBox() {
		$(".output-response-box").show();
		$(".run-status").show();
		$(".time-sec").show();
		$(".memory-kb").show();
		var compile_status = document.getElementById('compile_status').value;
		var run_status_status = document.getElementById('run_status_status').value;
		var run_status_time = document.getElementById('run_status_time').value;
		var run_status_memory = document.getElementById('run_status_memory').value;
		var run_status_output = document.getElementById('run_status_output').value;
		var run_status_stderr = document.getElementById('run_status_stderr').value;

		if(compile_status == "OK") {
			if(run_status_status == "AC") {
				$(".output-io").show();
				$(".output-error-box").hide();
				$(".output-io-info").show();
				$(".compile-status").children(".value").html(compile_status);
				$(".run-status").children(".value").html(run_status_status);
				$(".time-sec").children(".value").html(run_status_time);
				$(".memory-kb").children(".value").html(run_status_memory);
				$(".output-o").html(run_status_output);
			}
			else {
				$(".output-io").show();
				$(".output-io-info").hide();
				$(".output-error-box").show();
				$(".compile-status").children(".value").html(compile_status);
				$(".run-status").children(".value").html(run_status_status);
				$(".time-sec").children(".value").html(run_status_time);
				$(".memory-kb").children(".value").html(run_status_memory);
				$(".error-key").html("Run-time error (stderr)");
				$(".error-message").html(run_status_stderr);
			}
		}
		else {
			$(".output-io").show();
			$(".output-io-info").hide();
			$(".compile-status").children(".value").html("--");
			$(".run-status").children(".value").html("CE");
			$(".time-sec").children(".value").html("0.0");
			$(".memory-kb").children(".value").html("0");
			$(".error-key").html("Compile error");
			$(".error-message").html(compile_status);
		}
	}

	function checkForInitialData() {
		var code_content = document.getElementById('saved_code_content').value;
		var code_lang = document.getElementById('saved_code_lang').value;
		var code_input = document.getElementById('saved_code_input').value;
		if(code_content != "" && code_content != undefined && code_content != null) {
			languageSelected = code_lang;
			$('option:selected')[0].selected = false;
			$("option[value='"+code_lang+"']")[0].selected = true;
			editor.setValue(code_content);
			$(".output-i").html(code_input);
			$('#custom-input').val(code_input);
			showResultBox();
		}
	}

	$('#copy_code').on('mousedown', function() {
		initialVal=$('#copy_code')[0].innerHTML;
		$('#copy_link')[0].value = $('#copy_code').text();
		$('#copy_link').select();
		document.execCommand('copy');
		this.innerHTML = '<kbd>Link Copied To Clipboard</kbd>';
		$('body').on('mouseup',function(){
			$('#copy_code')[0].innerHTML = initialVal;
		});
	});

	/**
	 * function to update editorContent with current content of editor
	 *
	 */
	function updateContent(){
		editorContent = editor.getValue();
	}

	/**
	* function to translate the language to a file extension, txt as fallback
	*
	*/
	function translateLangToExt(ext) {
		return {
			"C":"c",
			"CPP":"cpp",
			"CSHARP":"cs",
		  "CLOJURE":"clj",
			"CSS":"css",
			"HASKELL":"hs",
			"JAVA":"java",
			"JAVASCRIPT":"js",
			"OBJECTIVEC":"m",
			"PERL":"pl",
			"PHP":"php",
			"PYTHON":"py",
			"R":"r",
			"RUBY":"rb",
			"RUST":"rs",
			"SCALA":"scala"
		}[ext] || "txt";
	}

	/**
	 * function to download a file with given filename with text as it's contents
	 *
	 */
	function downloadFile(filename, text, lang) {

		var ext = translateLangToExt(lang);

		var zip = new JSZip()
		zip.file(filename+"."+ext, text)
		var downloaded = zip.generate({type : "blob"})
		saveAs(downloaded, "test.zip")

	}

	/**
	 * function to send AJAX request to 'compile/' endpoint
	 *
	 */
	function compileCode(){

		// if a compile request is ongoing
		if(request_ongoing)
			return;

		// hide previous compile/output results
		$(".output-response-box").hide();

		// Change button text when this method is called
		$("#compile-code").html("Compiling..");

		// disable buttons when this method is called
		$("#compile-code").prop('disabled', true);
		$("#run-code").prop('disabled', true);

		// take recent content of the editor for compiling
		updateContent();

		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

		// if code_id present in url and updated compile URL
		if(window.location.href.includes('code_id')) {
			COMPILE_URL = '/../compile/';
		}

		var compile_data = {
			source: editorContent,
			lang: languageSelected,
			csrfmiddlewaretoken: csrf_token
		};

		request_ongoing = true;

		// AJAX request to Django for compiling code
		$.ajax({
			url: COMPILE_URL,
			type: "POST",
			data: compile_data,
			dataType: "json",
			timeout: 10000,
			success: function(response){

				request_ongoing = false;

				// Change button text when this method is called
				$("#compile-code").html("Compile it!");

				// enable button when this method is called
				$("#compile-code").prop('disabled', false);
				$("#run-code").prop('disabled', false);

				$("html, body").delay(500).animate({
					scrollTop: $('#show-results').offset().top
				}, 1000);

				$(".output-response-box").show();
				$(".run-status").hide();
				$(".time-sec").hide();
				$(".memory-kb").hide();

				if(response.message == undefined){
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
				}
				else{
					$(".output-io").show();
					$(".output-error-box").show();
					$(".output-io-info").hide();
					$(".compile-status").children(".value").html("--");
					$(".error-key").html("Server error");
					$(".error-message").html(response.message);
				}
			},
			error: function(error){

				request_ongoing = false;

				// Change button text when this method is called
				$("#compile-code").html("Compile it!");

				// enable button when this method is called
				$("#compile-code").prop('disabled', false);
				$("#run-code").prop('disabled', false);

				$("html, body").delay(500).animate({
					scrollTop: $('#show-results').offset().top
				}, 1000);

				$(".output-response-box").show();
				$(".run-status").hide();
				$(".time-sec").hide();
				$(".memory-kb").hide();

				$(".output-io").show();
				$(".output-error-box").show();
				$(".output-io-info").hide();
				$(".compile-status").children(".value").html("--");
				$(".error-key").html("Server error");
				$(".error-message").html("Server couldn't complete request. Please try again!");
			}
		});

	}


	/**
	 * function to send AJAX request to 'run/' endpoint
	 *
	 */
	function runCode(){

		// if a run request is ongoing
		if(request_ongoing)
			return;

		// hide previous compile/output results
		$(".output-response-box").hide();

		// Change button text when this method is called
		$("#run-code").html("Running..");

		// disable button when this method is called
		$("#compile-code").prop('disabled', true);
		$("#run-code").prop('disabled', true);

		// take recent content of the editor for compiling
		updateContent();

		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

		// if code_id present in url and update run URL
		if(window.location.href.includes('code_id')) {
			RUN_URL = '/../run/';
		}

		var input_given = $("#custom-input").val();

		request_ongoing = true;

		if( $("#custom-input-checkbox").prop('checked') == true ){
			var run_data = {
				source: editorContent,
				lang: languageSelected,
				input: input_given,
				csrfmiddlewaretoken: csrf_token
			};
			// AJAX request to Django for running code with input
			$.ajax({
				url: RUN_URL,
				type: "POST",
				data: run_data,
				dataType: "json",
				timeout: 10000,
				success: function(response){
					request_ongoing = false;

					if(location.port == "")
						$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + '/code_id=' + response.code_id + '/</kbd>';
					else
						$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + ':' +  location.port +'/code_id=' + response.code_id + '/</kbd>';

					$('#copy_code').css({'display': 'initial'});

					// Change button text when this method is called
					$("#run-code").html("Hack(run) it!");

					// enable button when this method is called
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

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
							$(".output-i").html(input_given);
						}
						else{
							$(".output-io").show();
							$(".output-io-info").hide();
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

					request_ongoing = false;

					// Change button text when this method is called
					$("#run-code").html("Hack(run) it!");

					// enable button when this method is called
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

					$("html, body").delay(500).animate({
						scrollTop: $('#show-results').offset().top
					}, 1000);

					$(".output-response-box").show();
					$(".run-status").show();
					$(".time-sec").show();
					$(".memory-kb").show();

					$(".output-io").show();
					$(".output-io-info").hide();
					$(".compile-status").children(".value").html("--");
					$(".run-status").children(".value").html("--");
					$(".time-sec").children(".value").html("0.0");
					$(".memory-kb").children(".value").html("0");
					$(".error-key").html("Server error");
					$(".error-message").html("Server couldn't complete request. Please try again!");
				}
			});
		}
		else{
			var run_data = {
				source: editorContent,
				lang: languageSelected,
				csrfmiddlewaretoken: csrf_token
			};
			// AJAX request to Django for running code without input\
			var timeout_ms = 10000;
			$.ajax({
				url: RUN_URL,
				type: "POST",
				data: run_data,
				dataType: "json",
				timeout: timeout_ms,
				success: function(response){
					if(location.port == "")
						$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + '/code_id=' + response.code_id + '/</kbd>';
					else
						$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + ':' +  location.port +'/code_id=' + response.code_id + '/</kbd>';

					$('#copy_code').css({'display': 'initial'});

					request_ongoing = false;

					// Change button text when this method is called
					$("#run-code").html("Hack(run) it!");

					// enable button when this method is called
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

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
							$(".output-i-info").hide();
							$(".compile-status").children(".value").html(response.compile_status);
							$(".run-status").children(".value").html(response.run_status.status);
							$(".time-sec").children(".value").html(response.run_status.time_used);
							$(".memory-kb").children(".value").html(response.run_status.memory_used);
							$(".output-o").html(response.run_status.output_html);
						}
						else{
							$(".output-io").show();
							$(".output-io-info").hide();
							$(".output-error-box").show();
							$(".compile-status").children(".value").html(response.compile_status);
							$(".run-status").children(".value").html(response.run_status.status);
							$(".time-sec").children(".value").html(response.run_status.time_used);
							$(".memory-kb").children(".value").html(response.run_status.memory_used);

							if (response.run_status.status == "TLE"){
								// Timeout error
								$(".error-key").html("Timeout error");
								$(".error-message").html("Time limit exceeded.");
							} else if(response.run_status.status == "MLE"){
								// Memory Limit Exceeded
								$(".error-key").html("Memory limit error");
								$(".error-message").html("Memory limit exceeded");
							}
							else {
								// General stack error
								$(".error-key").html("Run-time error (stderr)");
								$(".error-message").html(response.run_status.stderr);
							}
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

					request_ongoing = false;

					// Change button text when this method is called
					$("#run-code").html("Hack(run) it!");

					// enable button when this method is called
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

					$("html, body").delay(500).animate({
						scrollTop: $('#show-results').offset().top
					}, 1000);

					$(".output-response-box").show();
					$(".run-status").show();
					$(".time-sec").show();
					$(".memory-kb").show();

					$(".output-io").show();
					$(".output-io-info").hide();
					$(".compile-status").children(".value").html("--");
					$(".run-status").children(".value").html("--");
					$(".time-sec").children(".value").html("0.0");
					$(".memory-kb").children(".value").html("0");
					$(".error-key").html("Server error");
					$(".error-message").html("Server couldn't complete request. Please try again!");
				}
			});
		}

	}


	// when show-settings is clicked
	$("#show-settings").click(function(event){

		event.stopPropagation();

		// toggle visibility of the pane
		$("#settings-pane").toggle();

	});


	//close settings dropdown
	$(function(){
		$(document).click(function(){
			$('#settings-pane').hide();
		});
	});


	// when download-code is clicked
	$("#download-code").click(function(){

		// TODO: implement download code feature
		updateContent();
		downloadFile("code", editorContent, $("#lang").val());

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

		//Change the contents to the boilerplate code
		editor.setValue(langBoilerplate[languageSelected]);

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

	});

	//close dropdown after focus is lost
	var mouse_inside = false;
	$('#settings-pane').hover(function(){
		mouse_inside = true;
	}, function(){
		mouse_inside = false;
	});
	$('body').mouseup(function(){
		if(!mouse_inside)
			$('#settings-pane').hide();
	});

	// when indent-spaces is changed
	$("#indent-spaces").change(function(){

		indentSpaces = $("#indent-spaces").val();

		// update the indent size for the editor
		if(indentSpaces != ""){
			editor.getSession().setTabSize(indentSpaces);
		}

	});


	// to listen for a change in contents of the editor
	editor.getSession().on('change', function(e) {

		updateContent();

		// disable compile & run buttons when editor is empty
		if(editorContent != ""){
			$("#compile-code").prop('disabled', false);
			$('#compile-code').prop('title', "Press Shift+Enter");
			$("#run-code").prop('disabled', false);
			$('#run-code').prop('title', "Press Ctrl+Enter");
		}
		else{
			$("#compile-code").prop('disabled', true);
			$('#compile-code').prop('title', "Editor has no code");
			$("#run-code").prop('disabled', true);
			$('#run-code').prop('title', "Editor has no code");
		}

	});


	// toggle custom input textarea
	$('#custom-input-checkbox').click(function () {

		$(".custom-input-container").slideToggle();

	});


	// assigning a new key binding for shift-enter for compiling the code
	editor.commands.addCommand({

		name: 'codeCompileCommand',
		bindKey: {win: 'Shift-Enter',  mac: 'Shift-Enter'},
		exec: function(editor) {

			updateContent();
			if(editorContent != ""){
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
			}

		},
		readOnly: false // false if this command should not apply in readOnly mode

	});


	// when compile-code is clicked
	$("#compile-code").click(function(){

		compileCode();

	});


	// when run-code is clicked
	$("#run-code").click(function(){

		runCode();

	});

	// check if input box is to be show
	if($('#custom-input').val()!="")
	{
		$('#custom-input-checkbox').click();
	}


});
