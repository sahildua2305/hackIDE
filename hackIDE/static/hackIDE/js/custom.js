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
	* function to get filename by language given
	*
	*/
	function getFileNameByLang(lang){
		var filename = "code";
		switch (lang) {
			case "JAVA":
				var content = editorContent;
				var re = /public\sclass\s(.*)[.\n\r]*{/;
				try {
					filename = re.exec(content)[1];
					filename = filename.replace(/(\r\n\s|\n|\r|\s)*/gm,"");
				} catch (e) {}
				break;
			default:
				break;
		}
		return filename;
	}

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

		var user_filename_choice = prompt("Enter a filename for the .zip", filename)
		user_filename_choice = user_filename_choice.replace(/\s/g, '')
		var final_filename_choice
		if (user_filename_choice == null || user_filename_choice == ""){
			final_filename_choice = "default.zip"
		} else {
			final_filename_choice = user_filename_choice + ".zip"
		}

		saveAs(downloaded, final_filename_choice)

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

						var compileMsgResponse = response.compile_status;
						if (response.compile_status == "" || response.compile_status.length <= 1) {
							compileMsgResponse = "Empty Compile Response. Something went wrong while compiling.";
						}

						$(".error-message").html(compileMsgResponse);
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
	 * function to send AJAX request to 'run/' and 'savetoprofile/' endpoint
	 *
	 */

	 //check = 1 for running the code
	 // check = 0 for saving code to profile

	function test(check){

		// if a run request is ongoing
		if(request_ongoing)
			return;

		if(check == 1)
		{
			// hide previous compile/output results
			$(".output-response-box").hide();

			// Change button text when this method is called
			$("#run-code").html("Running..");

			RUN_URL = "run/";
		}


		if(check == 0)
		{
			$("#error_save_title").html("");
			$("#save-code-profile").html("Saving");
			$("#title-save").html("Saving");
			// disable button when this method is called
			$("#title-save").prop('disabled', true);
			$("#save-code-profile").prop('disabled', true);

			var code_title = $('#code-title').val();
			RUN_URL = "savetoprofile/";

		}

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

			if(check == 0)
			{
				run_data.code_title = code_title;				
			}
			// AJAX request to Django for running code with input
			$.ajax({
				url: RUN_URL,
				type: "POST",
				data: run_data,
				dataType: "json",
				timeout: 10000,
				success: function(response){
					request_ongoing = false;
					
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

					
					if(check == 0)
					{
						if ("error_save_title" in response){
							$("#error_save_title").html(response.error_save_title);
							$("#title-save").html("Save");
							$("#save-code-profile").html("Save Code To Profile");
							$("#title-save").prop("disabled", false);
							$("#save-code-profile").prop("disabled", false);
						}
						else
						{	
							$("#save-code-profile").html("Save Code To Profile");
							$("#save-code-profile").prop('disabled', true);
							$("#save-code-profile").html("Saved");
							$("#title-save").html("Saved");
							$("#code-title").val("");
							$("#title-save-modal").modal("toggle");
						}
					}

					else if(check == 1)
					{
						if(location.port == "")
							$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + '/code_id=' + response.code_id + '/</kbd>';
						else
							$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + ':' +  location.port +'/code_id=' + response.code_id + '/</kbd>';

						$('#copy_code').css({'display': 'initial'});

						// Change button text when this method is called
						$("#run-code").html("Hack(run) it!");

						// enable button when this method is called
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
					}
				},
				error: function(error){

					request_ongoing = false;
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

					if(check == 0)
					{
						$("#save-code-profile").html("Save Code To Profile");
						// enable button when this method is called
						$("#save-code-profile").prop('disabled', false);
					}

					else if(check == 1)
					{
						// Change button text when this method is called
					$("#run-code").html("Hack(run) it!");

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
				}
			});
		}
		else{
			var run_data = {
				source: editorContent,
				lang: languageSelected,
				csrfmiddlewaretoken: csrf_token
			};

			RUN_URL = "run/"

			if(check == 0)
			{
				run_data.code_title = code_title;
				RUN_URL = "savetoprofile/";				
			}
			// AJAX request to Django for running code without input\
			var timeout_ms = 10000;
			$.ajax({
				url: RUN_URL,
				type: "POST",
				data: run_data,
				dataType: "json",
				timeout: timeout_ms,
				success: function(response){
					request_ongoing = false;
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

					if(check == 0)
					{
						if ("error_save_title" in response){
							$("#error_save_title").html(response.error_save_title);
							$("#title-save").html("Save");
							$("#save-code-profile").html("Save Code To Profile");
							
							$("#title-save").prop("disabled", false);
							$("#save-code-profile").prop("disabled", false);
						}
						else
						{

							$("#save-code-profile").html("Save Code To Profile");
							$("#save-code-profile").prop('disabled', true);
							$("#save-code-profile").html("Saved");

							$("#title-save").html("Saved");
							$("#code-title").val("");

							$("#title-save-modal").modal("toggle");
						}
					}

					else if(check == 1)
					{
					
						if(location.port == "")
							$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + '/code_id=' + response.code_id + '/</kbd>';
						else
							$('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + ':' +  location.port +'/code_id=' + response.code_id + '/</kbd>';

						$('#copy_code').css({'display': 'initial'});

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
					}
				},
				error: function(error){

					request_ongoing = false;
					$("#compile-code").prop('disabled', false);
					$("#run-code").prop('disabled', false);

					if(check == 0)
					{
						$("#save-code-profile").html("Save Code To Profile");
						// enable button when this method is called
						$("#save-code-profile").prop('disabled', false);
					}

					else if(check == 1)
					{
						// Change button text when this method is called
						$("#run-code").html("Hack(run) it!");

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
				}
			});
		}

	}



$('#title-save').click(function(){
	test(0);
});


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

		var fileName = getFileNameByLang($("#lang").val());
		downloadFile(fileName, editorContent, $("#lang").val());

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
		test(1);
	});

	// check if input box is to be show
	if($('#custom-input').val()!="")
	{
		$('#custom-input-checkbox').click();
	}


	$("#register").click(function(){
		var username = $('#signup_username').val();
		var email = $("#signup_email").val();
		var password = $("#signup_password").val();

		$("#register").html("Registering");
		$("#register").prop('disabled', true);
		
		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();
		var form_data = {username : username, email : email, password : password, csrfmiddlewaretoken : csrf_token};
		$.ajax({
			url : 'register/',
			type : 'POST',
			data : form_data,
			dataType : 'json',
			timeout : '10000',
			success : function(response){
				$("#error_username").html(response.error_username);
				$("#error_email").html(response.error_email);
				$("#error_password").html(response.error_password);

				$("#register").prop('disabled', false);
				$("#register").html("Register");

				$("#msg").html(response.msg);
				if (response.error_username == "" && response.error_email == "" && response.error_password == "")
				{
					$("#register").html("Registered");
					location.reload();
				}
			},
		});
	});

	$('#login').click(function(){
		var username = $('#login_username').val();
		var password = $("#login_password").val();

		$("#login").html("Logging In");
		$("#login").prop("disabled", true);
		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

		var login_form_data = {username : username, password : password, csrfmiddlewaretoken : csrf_token};

		$.ajax({
			url : 'login/',
			type : 'POST',
			data : login_form_data,
			dataType : 'json',
			timeout : 10000,
			success : function(response){

				$("#login").prop("disabled", false);
				$("#login").html("Login");

				$('#login_msg').html(response.msg);
				if(response.msg != "Invalid credentials")
				{
					$("#login").html("Logged In Sucessfully");
					location.reload();
				}

			},
		});
	});

	$("#logout").click(function(){
		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();
		logout_data = {csrfmiddlewaretoken:csrf_token}		

		$.ajax({
			url : 'logout/',
			type : 'POST',
			data : logout_data,
			dataType : 'json',
			timeout : 10000,
			success : function(response){
				location.reload();
			},
		});
	});

	
	$("#data_table").on('click', '#close_data', function(){

		var i = $(this).closest('tr').attr('id');
		var parent = $(this).closest('tr');
		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();
		var remove_data = {csrfmiddlewaretoken:csrf_token, id:i};

		$.ajax({
			url: 'removecode/',
			type: "POST",
			data: remove_data,
			dataType: "json",
			timeout: 10000,
			success : function(response){
				parent.fadeOut('slow', function(){
					parent.remove();
				});
			},
		});
	});

	$("#profile_btn").click(function(){
		var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

		var profile_data = {csrfmiddlewaretoken:csrf_token};
		$.ajax({
			url: 'displayprofile/',
			type: "POST",
			data: profile_data,
			dataType: "json",
			timeout: 10000,
			success : function(response){
				$("#data_table").html("<tr><th>Code Id</th><th>Title</th><th></th></tr>");
				if(location.port == "")
				{
					for(var i=0;i<response.code_id.length;i++)
					{	
						var link = "/code_id=" + response.code_id[i] + "/";
						$("#data_table").append("<tr id='"+ response.code_id[i] +"'><td>"+response.code_id[i]+"</td><td>"+ response.code_title[i] +"</td><td><a target='_blank' href='"+ link +"' class='btn btn-success'>Open</a><button type='button'  id='close_data' class='close'><span id='close_data'>&times;</span></button></td></tr>");
					}
				}
				else
				{	
					for(var i=0;i<response.code_id.length;i++)
					{
						var link = "/code_id=" + response.code_id[i] + "/";
						$("#data_table").append("<tr id='"+ response.code_id[i] +"'><td>"+response.code_id[i]+"</td><td>"+ response.code_title[i] +"</td><td><a target='_blank' href='"+ link +"' class='btn btn-success'>Open</a><button type='button'  id='close_data' class='close'><span id='close_data'>&times;</span></button></td></tr>");
					}
				}
			},

		});		

	});


	editor.on('change', function(){
		$("#title-save").prop('disabled', false);
		$("#title-save").html("Save");

		$("#save-code-profile").prop('disabled', false);
		$("#save-code-profile").html("Save Code To Profile");
	});
});
