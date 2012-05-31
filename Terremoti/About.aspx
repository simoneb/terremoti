<%@ Page Title="" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="Terremoti.About" %>
<asp:Content ID="Content1" ContentPlaceHolderID="content" runat="server">
    <div class="page-header">
        <div class="pull-right"><a href="https://twitter.com/simonebu" class="twitter-follow-button" data-show-count="false">Follow @simonebu</a>
            <script>                !function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (!d.getElementById(id)) {
                        js = d.createElement(s);
                        js.id = id;
                        js.src = "//platform.twitter.com/widgets.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }
                } (document, "script", "twitter-wjs");</script></div>
        <h3>About</h3>                     
    </div>
    <div class="row">
        <div class="span8">
            <h4>Cosa</h4>
            <p>
                <abbr title="Terremoto Emilia Romagna" class="initialism">T.ER</abbr> raggruppa e presenta in vari formati i dati degli eventi sismici rilevanti che hanno colpito l'Emilia Romagna alla fine del mese di maggio 2012.
            </p>
            <p>
                I dati sono ottenuti dal sito dell'Istituto Nazionale di Geofisica e Vulcanologia e sono aggiornati automaticamente senza necessità di ricaricare la pagina. 
                I dati alla sorgente sono generati generalmente con alcune decine di minuti di ritardi rispetto all'evento sismico relativo, 
                e di conseguenza anche il contenuto di questa pagina presenta lo stesso ritardo.                
            </p>
        </div>
        <div class="span4">
            <h4>Perché</h4>
            <p>
                Questa pagina è stata creata perchè la zona colpita dal terremoto del 20 Maggio è molto vicina a dove abitavo fino a poche settimane fa, 
                e dove tutt'ora abitano la mia famiglia ed i miei amici. Per fortuna e purtroppo io sono lontano da casa.
            </p>
        </div>
    </div>
    <div class="row">
        <div class="span8">
            <h4>Chi sono</h4>
            <p>
                Sono un programmatore, lavoro a Vienna come technical lead di un team di sviluppo software.</p>
                <p>Per contatti <em>info</em> at <em>terremotoemiliaromagna.it</em></p>
        </div>
        <div class="span4">
            <h4>Codice</h4>
            <p>
                Il codice di queste pagine è disponibile e di pubblico dominio per chiunque voglia introdurre miglioramenti di qualsiasi genere. Inviatemi pull-requests e metterò online le vostre modifiche.
            </p>
            <p>
                <iframe src="github-buttons/github-btn.html?user=simoneb&repo=terremoti&type=fork&count=true"
  allowtransparency="true" frameborder="0" scrolling="0" width="95px" height="20px"></iframe>
            </p>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="additionalScripts" runat="server">
</asp:Content>
