(function WriteBackAction(input) {
	var current=new GlideRecordSecure('x_tcoj2_church_ct_case_lus');
	current.get(input.sys_id);
	//current.cause=input.cause;
	current.close_notes=input.lus_close_notes;
	current.resolution_code=input.lus_resolution_code;
	//current.notes_to_comments=input.notes_to_comments;
	new global.StateFlow().processFlow(current, 'd8069501c33231005f76b2c712d3aead', 'manual');
	current.update();
})(input);
