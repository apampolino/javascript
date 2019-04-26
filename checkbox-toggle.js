function checkBoxToggle(parent, children) {
    
    $(parent).click(function(){

        if ($(this).prop('checked')) {

            $(children).prop('checked', true);

        } else {

            $(children).prop('checked', false);
        }
    });

    $(children).each(function(){

        $(this).click(function(){

            let children_count = $(children).length;

            let children_checked = $(children + ':checked').length;

            if (children_count == children_checked) {

                $(parent).prop('checked', true);

            } else {

                $(parent).prop('checked', false);     
            }
        })
    });

}