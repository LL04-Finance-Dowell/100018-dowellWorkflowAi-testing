from django import forms


class CreateTemplateForm(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(attrs={"class": "textinput textInput form-control"}),
        max_length=100,
    )


class CreateDocumentForm(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(attrs={"class": "textinput textInput form-control"}),
        max_length=100,
    )
