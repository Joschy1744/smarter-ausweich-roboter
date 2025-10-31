/**
 * Smart Disco-Roboter – Calliope Mini V3 + MotionKit V2
 */
/**
 * Korrekte Maqueen-Syntax, 3-Zug-Ausweichmanöver, Untergrundbeleuchtung & Tanzmodus
 */
function setUnderglowCyan() {
    basic.setLedColor(0x00ffff)
}
function turnLeft(s: number) {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, s)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, s)
}
function setUnderglowMagenta() {
    basic.setLedColor(0xff00ff)
}
// --- Hinderniswarnung + Ausweichlogik ---
function warnung() {
    stopAll()
    basic.showIcon(IconNames.Surprised)
    music.playTone(131, music.beat(BeatFraction.Half))
    blinkUnderglow(3)
}
// --- Start per Taste A ---
input.onButtonPressed(Button.A, function () {
    gestartet = true
    basic.clearScreen()
    basic.showIcon(IconNames.Happy)
    music.playMelody("C5 E5 G5 C6", 120)
    discoStart()
})
function setUnderglowOrange() {
    basic.setLedColor(0xff8000)
}
function backward(s: number) {
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CCW, s)
}
function turnOffUnderglow() {
    basic.turnRgbLedOff()
    basic.clearScreen()
}
function blinkUnderglow(times: number) {
    for (let index = 0; index < times; index++) {
        basic.setLedColor(0xffffff)
        basic.pause(150)
        basic.turnRgbLedOff()
        basic.pause(150)
    }
}
function setUnderglowGreen() {
    basic.setLedColor(0x00ff00)
}
function turnRight(s: number) {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, s)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, s)
}
function stopAll() {
    maqueen.motorStop(maqueen.Motors.All)
}
// --- Tanzmodus per A+B ---
input.onButtonPressed(Button.AB, function () {
    maqueen.motorStop(maqueen.Motors.All)
    basic.showIcon(IconNames.Heart)
    music.startMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once)
    for (let index = 0; index < 2; index++) {
        forward(speed)
        setUnderglowGreen()
        basic.pause(500)
        backward(speed)
        setUnderglowRed()
        basic.pause(500)
        turnLeft(speed)
        setUnderglowMagenta()
        basic.pause(400)
        turnRight(speed)
        setUnderglowCyan()
        basic.pause(400)
    }
    stopAll()
    turnOffUnderglow()
    basic.clearScreen()
})
function discoStart() {
    for (let index = 0; index < 3; index++) {
        setUnderglowRed()
        basic.pause(150)
        setUnderglowGreen()
        basic.pause(150)
        setUnderglowMagenta()
        basic.pause(150)
        setUnderglowCyan()
        basic.pause(150)
    }
    turnOffUnderglow()
}
function setUnderglowRed() {
    basic.setLedColor(0xff0000)
}
// --- LED und Anzeige ---
function showDirection(dir: string) {
    basic.clearScreen()
    if (dir == "Vor") {
        basic.showArrow(ArrowNames.North)
    } else if (dir == "Rueck") {
        basic.showArrow(ArrowNames.South)
    } else if (dir == "Links") {
        basic.showArrow(ArrowNames.West)
    } else if (dir == "Rechts") {
        basic.showArrow(ArrowNames.East)
    }
}
// --- Bewegungsfunktionen ---
function forward(s: number) {
    maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, s)
}
function smartAvoid() {
    // 1️⃣ Rückwärts
    richtung = "Rueck"
    showDirection(richtung)
    setUnderglowRed()
    backward(speed)
    basic.pause(700)
    stopAll()
    basic.pause(100)
    // 2️⃣ Zufällige Drehung
    if (Math.randomBoolean()) {
        richtung = "Links"
        showDirection(richtung)
        setUnderglowOrange()
        turnLeft(speed)
    } else {
        richtung = "Rechts"
        showDirection(richtung)
        setUnderglowOrange()
        turnRight(speed)
    }
    basic.pause(600)
    stopAll()
    basic.pause(150)
    // 3️⃣ Zweiter Versuch, falls Hindernis noch da
    distance = maqueen.ultrasonic(maqueen.DistanceUnit.Centimeters)
    if (distance > 0 && distance < 15) {
        if (richtung == "Links") {
            richtung = "Rechts"
            showDirection(richtung)
            setUnderglowOrange()
            turnRight(speed)
        } else {
            richtung = "Links"
            showDirection(richtung)
            setUnderglowOrange()
            turnLeft(speed)
        }
        basic.pause(600)
        stopAll()
        basic.pause(150)
    }
    // 4️⃣ Wieder vorwärts
    richtung = "Vor"
    showDirection(richtung)
    setUnderglowGreen()
    forward(speed)
    basic.pause(1000)
    stopAll()
    turnOffUnderglow()
    basic.clearScreen()
}
let distance = 0
let richtung = ""
let gestartet = false
let speed = 0
speed = 100
basic.showString("Drueck A")
// --- Hauptschleife ---
basic.forever(function () {
    if (gestartet) {
        distance = maqueen.ultrasonic(maqueen.DistanceUnit.Centimeters)
        if (distance > 0 && distance < 15) {
            warnung()
            smartAvoid()
        } else {
            richtung = "Vor"
            showDirection(richtung)
            setUnderglowGreen()
            forward(speed)
        }
    } else {
        stopAll()
    }
})
